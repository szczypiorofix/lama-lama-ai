#!/bin/bash

echo "Launching Ollama ..."
ollama serve &

# Sleep for a while
sleep 5

echo "Downloading model: $OLLAMA_MODEL"
ollama pull "$OLLAMA_MODEL"

wait
