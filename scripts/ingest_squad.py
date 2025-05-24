from datasets import load_dataset
from embed_ollama import embed_batch
from utils import init_chroma_collection, insert_into_chroma

PERSIST_DIR = "../chroma"
COLLECTION_NAME = "squad_contexts"

print("🔄 Ładowanie danych...")
dataset = load_dataset("squad")

print(dataset)

texts = dataset["train"].select(range(50))["context"]
# texts = [x["context"] for x in dataset["train"][:50]]

print("🧠 Generowanie embeddingów przez Ollama...")
embeddings = embed_batch(texts)

print("💾 Zapisywanie do ChromaDB...")
collection = init_chroma_collection(PERSIST_DIR, COLLECTION_NAME)
insert_into_chroma(collection, texts, embeddings, prefix="squad")

print("✅ Gotowe!")
