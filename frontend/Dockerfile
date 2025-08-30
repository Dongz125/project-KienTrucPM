FROM node:22-alpine
RUN apk add curl --no-cache

# Copy and install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm i

# Source files
COPY . .

# Expose Vite dev port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

