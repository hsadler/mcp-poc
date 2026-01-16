FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install

# Copy application code
COPY server.js .
COPY public/ ./public/

EXPOSE 3000

CMD ["npm", "start"]
