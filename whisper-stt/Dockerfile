FROM python:3.10-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y ffmpeg nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Install Whisper
RUN pip install --no-cache-dir openai-whisper

# Create app directory
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
