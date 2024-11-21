import fitz
from docx import Document
from app.config import model, client

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
def get_bert_embedding(text):
    embedding = model.encode(text)
    return embedding.tolist()
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
def generate_search_str(data):
    project_summary = data.get("project_summarization", "")
    tech_suggestion = data.get("technology_suggestion", {})
    tech_details = " ".join([f"{key.capitalize()}: {value}" for key, value in tech_suggestion.items()])
    paragraph = f"{project_summary} The suggested technologies include: {tech_details}"
    return paragraph