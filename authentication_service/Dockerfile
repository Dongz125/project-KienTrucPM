FROM node:22-alpine
RUN apk add curl --no-cache

WORKDIR /app
COPY package*.json /app
RUN npm ci

# Copy worktree
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]

