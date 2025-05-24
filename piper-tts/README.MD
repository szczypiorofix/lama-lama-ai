docker build -t piper-tts .

docker run -p 8080:8080 piper-tts

echo 'Welcome to the world of speech synthesis!' | piper --model "model/pl_PL-gosia-medium.onnx" --output_file welcome.wav

piper --model "model/pl_PL-gosia-medium.onnx" --output_file welcome.wav --text "Co tam? jak tam?"

Piper: https://github.com/rhasspy/piper

Voices: https://github.com/rhasspy/piper/blob/master/VOICES.md


EXAMPLE ENV FILE:


#Ollama LLM
OLLAMA_MODEL=tinyllama

#Ollama API
#OLLAMA_API_URL=http://localhost:11434
OLLAMA_API_URL=http://ollama:11434

#ChromaDB
#CHROMADB_URL=http://localhost:8000
CHROMADB_URL=http://chromadb:8000

#Piper TTS
#PIPER_TTS_URL=http://localhost:8080
PIPER_TTS_URL=http://lama_tts:8080

#MySQL
MYSQL_HOST=lama_mysql
#MYSQL_HOST=localhost
MYSQL_DATABASE=lamalamadb
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=

# MySQL specific envs
MYSQL_ALLOW_EMPTY_PASSWORD=yes

