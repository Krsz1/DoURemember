FROM node:18-alpine
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm install --production || true

# Copy rest of the app
COPY . ./

EXPOSE 5020
CMD ["sh", "-c", "npm install && npm start"]
