import requests

OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
MODEL = "nomic-embed-text"

def get_embedding(text: str) -> list[float]:
    payload = {
        "model": MODEL,
        "prompt": text
    }
    response = requests.post(OLLAMA_EMBED_URL, json=payload)
    response.raise_for_status()
    return response.json()["embedding"]

def embed_batch(texts: list[str]) -> list[list[float]]:
    return [get_embedding(text) for text in texts]
