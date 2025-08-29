FROM node:22-alpine

WORKDIR /app
COPY package*.json /app
RUN npm ci

# Copy worktree
COPY . .
CMD ["npm", "run", "start"]

