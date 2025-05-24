import chromadb

def init_chroma_collection(persist_dir: str, collection_name: str):
    client = chromadb.PersistentClient(path=persist_dir)
    return client.get_or_create_collection(name=collection_name)

def insert_into_chroma(collection, texts, embeddings, ids=None, prefix="doc"):
    if ids is None:
        ids = [f"{prefix}-{i}" for i in range(len(texts))]
    collection.add(
        documents=texts,
        embeddings=embeddings,
        ids=ids
    )
