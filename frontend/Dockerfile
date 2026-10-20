FROM node:18-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

FROM node:18-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 8081
CMD ["pnpm", "run", "dev"]  # Start the development server at runtime
