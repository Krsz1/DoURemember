FROM node:22-alpine

# Aumenta el límite de memoria disponible para node
ENV NODE_OPTIONS="--max-old-space-size=2048"
 
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/app.js"]