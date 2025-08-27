# Stage 1: The builder
# Use a larger base image to handle the build process
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY ./src ./src
COPY server.js ./server.js
COPY test-candlestick.js ./test-candlestick.js

# Stage 2: The final image
# Use a minimal base image to run the application
FROM node:22-alpine

WORKDIR /app

# Only copy the necessary files from the builder stage
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
