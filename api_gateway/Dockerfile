FROM golang:1.25.0-alpine AS builder

EXPOSE 80

# Copy go.mod and go.sum to cache dependencies
COPY go.mod ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go application
# CGO_ENABLED=0 disables cgo for a smaller, statically linked binary
# -o /go-server specifies the output path and name
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app ./src

# Stage 2: The Final Stage
# Use a minimal base image
FROM alpine:3.22.1

RUN apk update
RUN apk upgrade
RUN apk add --no-cache curl busybox-extras

# Set the working directory
WORKDIR /server

# Copy the compiled binary from the builder stage
COPY --from=builder /app /server/app

# Run the application
CMD ["./app"]
