FROM postgres:17-alpine

RUN apk add --no-cache timescaledb
EXPOSE 5432

# Install timescale db
COPY ./setup.sql /docker-entrypoint-initdb.d/
