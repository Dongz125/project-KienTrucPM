# Use Node.js 22 Alpine
FROM node:22-alpine

# Install required packages for Chromium
RUN apk add --no-cache \
  chromium \
  curl \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Set environment so Puppeteer knows to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create app directory
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Run
EXPOSE 80
CMD ["npx", "tsx", "src/index.ts"]

