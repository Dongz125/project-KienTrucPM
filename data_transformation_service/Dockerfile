# Stage 1: The builder
# Use a larger base image to handle the build process
FROM node:22-alpine
RUN apk add curl --no-cache

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY ./src ./src
COPY server.js ./server.js
COPY test-candlestick.js ./test-candlestick.js

EXPOSE 3000

CMD ["npm", "start"]
