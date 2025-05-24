import os
from embed_ollama import embed_batch
from utils import init_chroma_collection, insert_into_chroma

BASE_DIR = "./data/wikidata5m"
TEXT_FILE = os.path.join(BASE_DIR, "wikidata5m_text.txt")
TRIPLE_FILE = os.path.join(BASE_DIR, "wikidata5m_transductive_train.txt")
BATCH_SIZE = 1000
PERSIST_DIR = "../chroma"
COLLECTION_NAME = "wikidata5m"

print("📖 Wczytywanie mapowania ID → opis encji...")
id_to_text = {}
with open(TEXT_FILE, "r", encoding="utf-8") as f:
    for line in f:
        parts = line.strip().split()
        if len(parts) > 1:
            entity_id = parts[0]
            description = " ".join(parts[1:])
            id_to_text[entity_id] = description

print("🚀 Start przetwarzania trójek w batchach...")
collection = init_chroma_collection(PERSIST_DIR, COLLECTION_NAME)

with open(TRIPLE_FILE, "r", encoding="utf-8") as f:
    batch = []
    batch_ids = []
    for i, line in enumerate(f):
        h, r, t = line.strip().split()
        head = id_to_text.get(h, h)
        rel = id_to_text.get(r, r)
        tail = id_to_text.get(t, t)
        sentence = f"{head} {rel} {tail}"
        batch.append(sentence)
        batch_ids.append(f"triple-{i}")

        if len(batch) == BATCH_SIZE:
            embeddings = embed_batch(batch)
            insert_into_chroma(collection, batch, embeddings, ids=batch_ids)
            batch = []
            batch_ids = []

    # Obsłuż resztkę (jeśli niepełny batch na końcu)
    if batch:
        embeddings = embed_batch(batch)
        insert_into_chroma(collection, batch, embeddings, ids=batch_ids)

print("✅ Wszystkie dane zostały przetworzone i zapisane do ChromaDB.")
