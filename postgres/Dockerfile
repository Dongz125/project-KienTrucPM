FROM postgres:17-alpine

RUN apk add --no-cache timescaledb

# Install timescale db
COPY ./create_timescaledb.sql /docker-entrypoint-initdb.d/
