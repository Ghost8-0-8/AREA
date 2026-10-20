FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g pnpm
RUN pnpm install
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 8080

CMD ["pnpm", "run", "dev"]
