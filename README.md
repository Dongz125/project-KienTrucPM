# Promptpal

## Getting Started

Before running Docker, make sure to create an `.env` file with the items provided in `.env.example`, or Docker might create stuff incorrectly.

Run:

```
docker compose up -d
```

To shut down containers after:

```
docker compose down
```

## Ports Overview

These are the ports used by the application:

|    Port     | Service                         |
| :---------: | ------------------------------- |
|    5432     | PostgreSQL                      |
|  80 (HTTP)  | API Gateway                     |
| 443 (HTTPS) | _Reserved for future use_       |
|    5552     | RabbitMQ's streaming port       |
|    5672     | RabbitMQ's messaging AMQP port  |
|    15672    | RabbitMQ's admin panel          |
|    27017    | MongoDB                         |
|    27018    | Mongo Express (GUI for MongoDB) |
