FROM node:18-slim

# Install curl + unzip (Debian-based)
RUN apt-get update && apt-get install -y curl unzip

# Install Piper binary (x86_64)
RUN curl -L -o /tmp/piper.tar.gz https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz \
 && tar -xzf /tmp/piper.tar.gz -C /usr/bin/ --strip-components=1 \
 && chmod +x /usr/bin/piper \
 && rm /tmp/piper.tar.gz

# Create app directory
WORKDIR /app

# Copy server code
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x /usr/bin/piper

# Expose port
EXPOSE 8080

CMD ["npm", "start"]
