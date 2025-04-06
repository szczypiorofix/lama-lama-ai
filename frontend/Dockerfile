FROM node:20.19

ARG DEFAULT_PORT=5173

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

ENV PORT=${DEFAULT_PORT}

EXPOSE $PORT

CMD ["npm", "run", "dev"]
