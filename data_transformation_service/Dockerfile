# Node server can't be built into binary
FROM node:22-alpine

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Copy source over
COPY ./src ./src
COPY server.js ./server.js
COPY test-candlestick.js ./test-candlestick.js
EXPOSE 3000

# Entrypoint
CMD ["npm", "start"]

