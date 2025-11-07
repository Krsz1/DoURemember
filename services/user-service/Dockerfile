FROM node:22-alpine

# Increase node memory
ENV NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# If using TypeScript, build step would go here. Our scaffold uses plain JS.

EXPOSE 5001

CMD ["node", "src/app.js"]
