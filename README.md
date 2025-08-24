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

## Technical points

<details>
<summary>What is the volumes folder?</summary>

Docker images and containers don't have a storage. You need to specify that storage somewhere. Volumes is how we do that. They are just essentially where containers store their data into.

</details>

<details>
<summary>Services can't connect</summary>

Services in a compose-stack are hidden behind a _hostname_. To connect to rabbitmq, for example, you can't use `localhost:5672`, but you need to use `rabbitmq:5672`. Same goes with `postgres:5432`.

</details>

## Ports Overview

These are the ports used by the application:

|    Port     | Service                              |
| :---------: | ------------------------------------ |
|    5432     | PostgreSQL                           |
|  80 (HTTP)  | API Gateway                          |
| 443 (HTTPS) | _Reserved for future use_            |
|    5552     | RabbitMQ's streaming port            |
|    5672     | RabbitMQ's messaging AMQP port       |
|    15672    | RabbitMQ's admin panel               |
|    27017    | MongoDB                              |
|    27018    | Mongo Express (GUI for MongoDB)      |
|    3000     | Data Transformation Service (NodeJS) |
