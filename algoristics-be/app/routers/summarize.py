import re
import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.utils import read_docx, read_pdf, read_txt, get_chat_completion, generate_search_str
from app.models.schemas import ProjectAnalysisResponse
from typing import Optional
router = APIRouter()

@router.post("/summarize",response_model=ProjectAnalysisResponse)
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
        summary = json.loads(summary)
        summary['search_str'] = generate_search_str(summary['summary_json'])
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating project analysis.")

