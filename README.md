# Lama Lama AI

Local AI chatbox using Ollama.

## Example of use

Put Ollama settings (url and model) in ./backend/.env file

for example:
```
OLLAMA_API_URL=http://ollama:11434/api/chat
OLLAMA_MODEL=tinyllama
```

Endpoints for testing:

Just ask Ollama
```http://localhost:3000/v1/api/ask```
POST: body
```
{
    ""question": "What kind of horse is this named 'Lightning'?"
}
```

Ask Ollama using previously put context data (RAG)
```http://localhost:3000/v1/api/ask-context```
POST: body
```
{
    "question": "Give me some information about a pony named 'Lightning'"
}
```

Put data to ChromaDB
```http://localhost:3000/v1/api/putdata```
POST: body
```
{
    "list": [
        {
            "id": "1",
            "text": "There is a little horse. He's name is 'Lightning'. He is a pony."
        },
        {
            "id": "2",
            "text": "There is a little white pony. His name is 'Lightning'. He is a very clever and smart pony."
        },
        {
            "id": "3",
            "text": "A little pony named 'Lightning' like to eat apples and run through the pastures. He is quite small. He is about 100 cm tall."
        }
    ]
}
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
