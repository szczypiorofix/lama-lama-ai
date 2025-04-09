#!/bin/bash

echo "Launching Ollama ..."
ollama serve &

# Sleep for a while
sleep 5

echo "Downloading tinyllama model ..."
ollama pull tinyllama

wait
