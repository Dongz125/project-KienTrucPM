FROM postgres:17-alpine

RUN apk add --no-cache timescaledb

# Install timescale db
COPY ./setup.sql /docker-entrypoint-initdb.d/
EXPOSE 5432

