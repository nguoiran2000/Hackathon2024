from fastapi import APIRouter, HTTPException
from app.models.schemas import SearchQuery, EmployeeData, ProjectData
from app.services.feed import FeedEmployee, FeedProject
from app.services.search import project_search, employee_search
from app.config import connect_opensearch
from typing import List, Optional

router = APIRouter()

@router.post("/api/search")
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

@router.post("/api/feed_employee")
async def feed_employee(query: List[EmployeeData]):
    try:
        client = connect_opensearch()
        FeedEmployee(client,query)
        return {"status": "success", "message": "Employees fed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/feed_project")
async def feed_project(query: List[ProjectData]):
    try:
        client = connect_opensearch()
        FeedProject(client,query)
        return {"status": "success", "message": "Projects fed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   
