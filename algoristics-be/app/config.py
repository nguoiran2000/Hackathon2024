import os
from dotenv import load_dotenv
from opensearchpy import OpenSearch, RequestsHttpConnection
from sentence_transformers import SentenceTransformer
from openai import OpenAI

load_dotenv()

def connect_opensearch():
    return OpenSearch(
        hosts=[{'host': os.getenv("OPENSEARCH_HOST"), 'port': os.getenv("OPENSEARCH_PORT")}],
        http_auth=(os.getenv("OPENSEARCH_USER"), os.getenv("OPENSEARCH_PASSWORD")),
        use_ssl=False,
        verify_certs=False,
        connection_class=RequestsHttpConnection
    )
client = OpenAI( api_key = os.getenv("OPENAPI_KEY"))
model = SentenceTransformer(os.getenv("LLM_MODEL"))
