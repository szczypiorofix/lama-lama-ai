# Lama Lama AI

Local AI chatbox using Ollama.

## Example of use

### Requirements for local development

* [Ollama](https://ollama.com/library/gemma3) download, install and pull a model you like (e.g. ```ollama pull gemma3:1b```)
* Python (e.g. v3.10.10 installed locally)
* [ChromaDB](https://docs.trychroma.com/docs/overview/getting-started?lang=typescript) run ```pip install chromadb``` to install ChromaDB package by Python package manager

Put Ollama settings (url and model) in ./backend/.env file

for example:
```
OLLAMA_MODEL=gemma3:1b  # chosen LLM Olama model

#OLLAMA_API_URL=http://ollama:11434/api/chat  # for Docker build
OLLAMA_API_URL=http://localhost:11434/api/chat  # url for Ollama installed locally

#CHROMADB_URL=http://chromadb:8000 # for Docker build
CHROMADB_URL=http://localhost:8000 # url for ChromaDB installed locally
```
You can run backend, frontend, chroma and Ollama in a separate terminal, or you can use Docker (docker-compose) tool.
* frontend: from ./frontend: ```npm run dev```
* backend: from ./backend: ```npm run start:debug```
* ChromaDB: in root (or any) folder: ```chroma run```
* Ollama: in root (or any) folder: just make sure ```ollama ps``` returns a name of a model you want to use

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
