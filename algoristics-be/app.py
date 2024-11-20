import os
import re
import json
import fitz
import uvicorn
from openai import OpenAI
from docx import Document
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, List
from starlette.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI,File,UploadFile,HTTPException
from opensearchpy import OpenSearch,RequestsHttpConnection

load_dotenv()

model = SentenceTransformer(os.getenv("LLM_MODEL"))
openAIModel = os.getenv("OPENAPI_MODEL")
client = OpenAI( api_key = os.getenv("OPENAPI_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List allowed origins here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

class SearchQuery(BaseModel):
    query_text: str
class TechnologySuggestion(BaseModel):
    infra: str
    database: str
    language: str
    other_tools: str
class SummaryJson(BaseModel):
    project_summarization: str
    technology_suggestion: TechnologySuggestion
class DevelopmentPlan(BaseModel):
    time: str
    explain: str
    feature_list: List[str]
class ProjectAnalysisResponse(BaseModel):
    summary: str
    summary_json: SummaryJson
    development_plan: List[DevelopmentPlan]
class EmployeeData(BaseModel):
    name: str
    email: str
    department: str
    position: str
    specializations: List[str]
    skills: List[str]
    experiences: str
    overview: str
class ProjectData(BaseModel):
    name: str
    business_domain: str
    overview: str
    technology: List[str]
    project_manager: str
    email: str
    tech_issues: str

def read_docx(file) -> str:
    """Extracts text from a DOCX file."""
    doc = Document(file)
    return "\n".join([para.text for para in doc.paragraphs])
def read_pdf(file) -> str:
    """Extracts text from a PDF file."""
    text = ""
    # Read file into memory as bytes
    file_bytes = file.read()  # This reads the entire file content as bytes
    # Open the PDF from the byte stream
    pdf = fitz.open(stream=file_bytes, filetype="pdf")
    for page in pdf:
        text += page.get_text("text")
    pdf.close()
    return text
def read_txt(file) -> str:
    """Extracts text from a TXT file."""
    return file.read().decode("utf-8")
def connect_opensearch():
    client = OpenSearch(
        hosts=[{'host': os.getenv("OPENSEARCH_HOST"), 'port': os.getenv("OPENSEARCH_PORT")}],
        http_aduth=(os.getenv("OPENSEARCH_USER"), os.getenv("OPENSEARCH_PASSWORD")),
        use_ssl=False,
        verify_certs=False,
        connection_class=RequestsHttpConnection
    )
    return client
def get_bert_embedding(text):
    embedding = model.encode(text)
    return embedding.tolist()
def project_search(client, query_text, index_name: str = "projects", top_k=5):
    # Get BERT embedding for the query
    query_embedding = get_bert_embedding(query_text)
    semantic_query = {
        "query": {
            "function_score": {
                "query": {
                    "match_all": {}  # We are matching all documents for the neural search
                },
                "functions": [
                    {
                        "script_score": {
                            "script": {
                                "source": "(cosineSimilarity(params.query_embedding, doc['embedding']) + 1.0)/2",
                                "params": {
                                    "query_embedding": query_embedding
                                }
                            }
                        }
                    }
                ]
            }
        },
        "size": top_k * 2  # Retrieve more results to re-rank them later
    }
    keyword_query = {
        "query":{
                "multi_match": {
                "query": query_text,   # Replace with the user input
                "fields": [
                    "name^1",
                    "business_domain^1.5",  # Boost 'business_domain' moderately
                    "overview^1",           # Default boost for 'overview'
                    "technology^1",         # Default boost for 'technology'
                    "projectManager^1.5",    # Boost 'projectManager' moderately
                    "tech_issues^1"
                ],
                "type": "best_fields",   # Default type for multi_match to match the best fields
                "operator": "or"         # OR operator between the fields
                }
            },
        "size": top_k * 2
    }
    
    semantic_result = client.search(index=index_name, body=semantic_query)
    keyword_result = client.search(index=index_name, body=keyword_query)

    keyword_max = keyword_result['hits']['max_score']

    search_result = []

    for hit in keyword_result['hits']['hits']:
        hit['_score'] = hit['_score']/keyword_max

    semantic_lookup = {item["_id"]: item["_score"] for item in semantic_result['hits']['hits']}

    for result in keyword_result['hits']['hits']:
        doc = (result['_source'].pop('embedding', None), result['_source'])[1]
        semantic_score = semantic_lookup.get(result["_id"], 0)  
        search_result.append((doc, 0.5*result['_score'] + semantic_score*0.5))

    for result in semantic_result['hits']['hits']:
        doc = (result['_source'].pop('embedding', None), result['_source'])[1]
        if doc not in [x[0] for x in search_result]:
            keyword_score = next((keyword["_score"] for keyword in keyword_result['hits']['hits'] if keyword["_id"] == result["_id"]), 0)
            search_result.append((doc, 0.5*result['_score'] + keyword_score*0.5))

    # Sort based on relevance scores
    search_result.sort(key=lambda x: x[1], reverse=True)

    return search_result[:top_k]
def employee_search(client, query_text, index_name: str = "employees", top_k=5):
    # Get BERT embedding for the query
    query_embedding = get_bert_embedding(query_text)
    # Perform hybrid search on the employee index
    semantic_query = {
        "query": {
            "function_score": {
                "query": {
                    "match_all": {}  # We are matching all documents for the neural search
                },
                "functions": [
                    {
                        "script_score": {
                            "script": {
                                "source": "(cosineSimilarity(params.query_embedding, doc['embedding']) + 1.0)/2",
                                "params": {
                                    "query_embedding": query_embedding
                                }
                            }
                        }
                    }
                ]
            }
        },
        "size": top_k * 2  # Retrieve more results to re-rank them later
    }
    keyword_query = {
        "query":{
                "multi_match": {
                "query": query_text,   # Replace with the user input
                "fields": [
                    "department^2",  # Boosting the 'department' field. Matches in 'department' are important, but less so than 'name' (boosted by a factor of 2).
                    "position^2",  # Boosting the 'position' field. Matches in 'position' have the same relevance as 'department' (boosted by a factor of 2).
                    "specializations^1",  # Boosting the 'specializations' field. Matches in 'specializations' are still considered relevant, but have a lower importance (boosted by a factor of 1).
                    "skills^1",  # Boosting the 'skills.tech' field. This will also have a lower importance compared to 'name', 'department', and 'position'.
                    "experiences^1",  # Boosting the 'experiences' field. Matches here are less relevant but still contribute to the overall score (boosted by a factor of 1).
                    "overview^1"
                ],
                "type": "best_fields",   # Default type for multi_match to match the best fields
                "operator": "or"         # OR operator between the fields
                }
            },
        "size": top_k * 2
    }
    
    semantic_result = client.search(index=index_name, body=semantic_query)
    keyword_result = client.search(index=index_name, body=keyword_query)

    keyword_max = keyword_result['hits']['max_score']

    search_result = []

    for hit in keyword_result['hits']['hits']:
        hit['_score'] = hit['_score']/keyword_max

    semantic_lookup = {item["_id"]: item["_score"] for item in semantic_result['hits']['hits']}

    for result in keyword_result['hits']['hits']:
        doc = (result['_source'].pop('embedding', None), result['_source'])[1]
        semantic_score = semantic_lookup.get(result["_id"], 0)  
        search_result.append((doc, 0.5*result['_score'] + semantic_score*0.5))

    for result in semantic_result['hits']['hits']:
        doc = (result['_source'].pop('embedding', None), result['_source'])[1]
        if doc not in [x[0] for x in search_result]:
            keyword_score = next((keyword["_score"] for keyword in keyword_result['hits']['hits'] if keyword["_id"] == result["_id"]), 0)
            search_result.append((doc, 0.5*result['_score'] + keyword_score*0.5))

    # Sort based on relevance scores
    search_result.sort(key=lambda x: x[1], reverse=True)

    return search_result[:top_k]
def get_chat_completion(messages, model):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=1,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "project_summary",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "summary": {
                            "type": "string",
                            "description": "A concise summary of the project's main objectives, scope, and key details, including business goals. Provide the response in markdown format."
                        },
                        "summary_json": {
                            "type": "object",
                            "description": "A JSON object summarizing the project's business objectives and recommended technologies.",
                            "properties": {
                                "project_summarization": {
                                    "type": "string",
                                    "description": "A concise summary that captures the project's main objectives, scope, and key details."
                                },
                                "technology_suggestion": {
                                    "type": "object",
                                    "description": "Recommended technologies based on the project's requirements, specifying infrastructure, database, programming languages, and other relevant tools.",
                                    "properties": {
                                        "infra": {
                                            "type": "string",
                                            "description": "Recommended infrastructure technologies, such as cloud providers or hosting environments."
                                        },
                                        "database": {
                                            "type": "string",
                                            "description": "Recommended database technologies, such as relational or NoSQL databases."
                                        },
                                        "language": {
                                            "type": "string",
                                            "description": "Programming languages best suited for the project."
                                        },
                                        "other_tools": {
                                            "type": "string",
                                            "description": "Additional tools or technologies relevant to the project, such as CI/CD pipelines, monitoring tools, or frameworks."
                                        }
                                    },
                                    "required": [
                                        "infra",
                                        "database",
                                        "language",
                                        "other_tools"
                                    ],
                                    "additionalProperties": False
                                }
                            },
                            "required": [
                                "project_summarization",
                                "technology_suggestion"
                            ],
                            "additionalProperties": False
                        },
                        "development_plan": {
                            "type": "array",
                            "description": "A list of phases for the project.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "time": {
                                        "type": "string",
                                        "description": "The time allocated for each phase, e.g., '3 months'."
                                    },
                                    "explain": {
                                        "type": "string",
                                        "description": "Explain why this phase take x months"
                                    },
                                    "feature_list": {
                                        "type": "array",
                                        "description": "A list of features for the given phase.",
                                        "items": {
                                            "type": "string",
                                            "description": "Each feature included in the phase."
                                        }
                                    }
                                },
                                "required": [
                                    "time",
                                    "explain",
                                    "feature_list"
                                ],
                                "additionalProperties": False
                            }
                        }
                    },
                    "required": [
                        "summary",
                        "summary_json",
                        "development_plan"
                    ],
                    "additionalProperties": False
                }
            }
        }
    )
    return response.choices[0].message.content
def generate_employee_paragraph(employee):
    return (
        f"name: {employee['name']}\n"
        f"email: {employee['email']}\n"
        f"department: {employee['department']}\n"
        f"position: {employee['position']}\n"
        f"specializations: {', '.join(employee['specializations'])}\n"
        f"skills: {', '.join(employee['skills'])}\n"
        f"experiences: {employee['experiences']}\n"
        f"overview: {employee['overview']}\n"
    )
def FeedEmployee(client, data, index_name: str = "employees"):
    if not client.indices.exists(index=index_name):
        client.indices.create(index=index_name, body={
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "mappings": {
                "properties": {
                    "name": {"type": "text"},
                    "email": {"type": "text"},
                    "department": {"type": "keyword"},
                    "position": {"type": "keyword"},
                    "specializations": {"type": "text"},
                    "skills": {"type": "text"},
                    "experiences": {"type": "text"},
                    "overview": {"type": "text"},
                    "embedding": {"type": "knn_vector", "dimension": 384}
                }
            }
        })

    for doc_id, doc in enumerate(data):
        doc["embedding"] = model.encode(generate_employee_paragraph(doc))  
        client.index(index=index_name, id=doc_id, body=doc)
def generate_project_paragraph(project):
    return (
        f"name: {project['name']}\n"
        f"business_domain: {project['business_domain']}\n"
        f"overview: {project['overview']}\n"
        f"technology: {', '.join(project['technology'])}\n"
        f"project_manager: {project['project_manager']}\n"
        f"email: {project['email']}\n"
        f"tech_issues: {project['tech_issues']}\n"
    )
def FeedProject(client, data, index_name: str = "projects"):
    if not client.indices.exists(index=index_name):
        client.indices.create(index=index_name, body={
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "mappings": {
                "properties": {
                    "name": {"type": "text"},
                    "business_domain": {"type": "keyword"},
                    "overview": {"type": "text"},
                    "technology": {"type": "keyword"},
                    "projectManager": {"type": "text"},
                    "email": {"type": "text"},
                    "tech_issues": {"type": "text"},
                    "embedding": {"type": "knn_vector", "dimension": 384}
                }
            }
        })

    for doc_id, doc in enumerate(data):
        doc["embedding"] = model.encode(generate_project_paragraph(doc))  
        client.index(index=index_name, id=doc_id, body=doc)

@app.post("/summarize",response_model=ProjectAnalysisResponse)
async def summarize_file(file: UploadFile = File(...),model: Optional[str] = "gpt-4o-mini"):
    try:

        if file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            document_text = read_docx(file.file)
        elif file.content_type == "application/pdf":
            document_text = read_pdf(file.file)
        elif file.content_type == "text/plain":
            document_text = read_txt(file.file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Upload a DOCX, PDF, or TXT file.")
        document_text = document_text.replace("\n"," ")
        prompt = """
                Analyze the provided project specification thoroughly and deliver a detailed response structured as a JSON object with the following fields:

                1. **Summary**:
                    - Provide a **detailed and comprehensive summary** of the project's main objectives, scope, and business goals.
                    - Highlight key requirements, challenges, and intended outcomes.
                    - Format the summary in markdown for better readability.
                    - Ensure the summary is neither vague nor overly concise—focus on clarity and relevance.

                2. **Detailed Summary JSON**:
                    - **Project Summarization**: Write a **detailed summary** that fully encapsulates the project's essence, its business objectives, scope, and key details.
                    - **Technology Suggestions**: Provide **specific and tailored technology recommendations**, covering:
                        - **Infrastructure**: Recommended hosting platforms or cloud providers (e.g., AWS, Azure, Google Cloud).
                        - **Database**: Suitable database technologies (e.g., MySQL, MongoDB, PostgreSQL).
                        - **Programming Language**: Programming languages ideal for development (e.g., Python, C#, Java).
                        - **Other Tools**: Additional tools or technologies (e.g., CI/CD pipelines, monitoring solutions, frameworks).

                3. **`Development Plan`**:  
                    - Break the project into phases, each with a **time estimate** (e.g., 3 months, 6 weeks).  
                    - Explain the time needed for each phase
                    - For each phase, create a **function list** tailored to the project scope and objectives.  
                    - Include **specific business rules**, user interactions, or system integrations that are necessary for the functionalities.  
                    - Avoid vague or generic terms—focus on actionable and relevant features.  
                
                ```json
                {
                    "summary": "string (markdown format)",
                    "summary_json": {
                        "project_summarization": "string",
                        "technology_suggestion": {
                            "infra": "string",
                            "database": "string",
                            "language": "string",
                            "other_tools": "string"
                        }
                    },
                    "development_plan": [
                        {
                            "time": "string",
                            "explain" : "string",
                            "feature_list": ["string"]
                        }
                    ]
                }
                ```

                ### Key Notes for Generation:
                - Avoid vague or generic terms; use details directly related to the project specification.
                - Ensure all fields are **fully developed**, with sufficient depth and specificity.
                - Resources listed should **align closely with the recommended technologies**.

                """
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"""
                            {prompt}  
                            This is the project specification:  
                            ``` 
                            {document_text}
                            ```
                            """
                        )
                    }
                ]
            }
        ]

        summary = get_chat_completion(messages, model=model).strip("'")
        summary = re.sub(r'(?<!\\)\n', ' ', summary).lstrip("'```json").rstrip("```'").strip("'")
        return json.loads(summary)

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating project analysis.")

@app.post("/api/search")
async def search(query: SearchQuery, entity_type: Optional[str] = "both"):
    try:
        client = connect_opensearch()
        results = {}

        # Search for projects if specified or "both"
        if entity_type in ["projects", "both"]:
            results["projects"] = project_search(client,query.query_text)

        # Search for employees if specified or "both"
        if entity_type in ["employees", "both"]:
            results["employees"] = employee_search(client,query.query_text)

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feed_employee")
async def feed_employee(query: List[EmployeeData]):
    try:
        client = connect_opensearch()
        FeedEmployee(client,query)
        return {"status": "success", "message": "Employees fed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feed_project")
async def feed_project(query: List[ProjectData]):
    try:
        client = connect_opensearch()
        FeedProject(client,query)
        return {"status": "success", "message": "Projects fed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/seed_data")
async def seed_data():
    try:
        EmployeeData = [
            {
                "name": "",
                "email": "",
                "department": "",
                "position": "",
                "specializations": ["", ""],
                "skills": ["", "", ""],
                "experiences": "",
                "overview": ""
            }
            ]
        client = connect_opensearch()
        FeedEmployee(client,EmployeeData)
        FeedProject(client,ProjectData)
        return {"status": "success", "message": "Seed data successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)