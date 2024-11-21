from app.services.utils import get_bert_embedding

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
        search_result.append((doc, 0.1*result['_score'] + semantic_score*0.9))

    for result in semantic_result['hits']['hits']:
        doc = (result['_source'].pop('embedding', None), result['_source'])[1]
        if doc not in [x[0] for x in search_result]:
            keyword_score = next((keyword["_score"] for keyword in keyword_result['hits']['hits'] if keyword["_id"] == result["_id"]), 0)
            search_result.append((doc, 0.9*result['_score'] + keyword_score*0.1))

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
        search_result.append((doc, 0.1*result['_score'] + semantic_score*0.9))

    for result in semantic_result['hits']['hits']:
        doc = (result['_source'].pop('embedding', None), result['_source'])[1]
        if doc not in [x[0] for x in search_result]:
            keyword_score = next((keyword["_score"] for keyword in keyword_result['hits']['hits'] if keyword["_id"] == result["_id"]), 0)
            search_result.append((doc, 0.9*result['_score'] + keyword_score*0.1))

    # Sort based on relevance scores
    search_result.sort(key=lambda x: x[1], reverse=True)

    return search_result[:top_k]