from app.config import model
import json
def generate_employee_paragraph(employee):
    return (
        f"name: {employee.name}\n"
        f"email: {employee.email}\n"
        f"department: {employee.department}\n"
        f"position: {employee.position}\n"
        f"specializations: {', '.join(employee.specializations)}\n"
        f"skills: {', '.join(employee.skills)}\n"
        f"experiences: {employee.experiences}\n"
        f"overview: {employee.overview}\n"
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
        embedding =  model.encode(generate_employee_paragraph(doc)) 
        doc = json.loads(doc.json())
        doc["embedding"] = embedding
        client.index(index=index_name, id=doc_id, body=doc)
def generate_project_paragraph(project):
    project = json.dumps(project.model_dump(), indent=4)
    return (
        f"name: {project.name}\n"
        f"business_domain: {project.business_domain}\n"
        f"overview: {project.overview}\n"
        f"technology: {', '.join(project.technology)}\n"
        f"project_manager: {project.project_manager}\n"
        f"email: {project.email}\n"
        f"tech_issues: {project.tech_issues}\n"
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
        embedding =  model.encode(generate_employee_paragraph(doc)) 
        doc = json.loads(doc.json())
        doc["embedding"] = embedding
        client.index(index=index_name, id=doc_id, body=doc)