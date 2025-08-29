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

<details>
<summary>NPM new packages don't load</summary>

Docker images after building are immutable. We can only change the source file of what is running, not the dependencies. Delete the image with `docker image remove` (use `docker image ls` to see what images are installed) to reset docker.

For example, if you want to add a new package to `data-transformation-service`, you need to `docker image remove promptpal-data-transformation-service`, then run compose again to rebuild the dependencies.

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
| 3001 | Authentication Service (NodeJS)             |
|    5173     | Frontend Service (Vite + React)      |


## Networks Overview

There are mainly three networks in the Docker Compose stack:
- `api_network`: Those that interact with API gateway: Data Transformation, Frontend, Authentication
- `db_network`: Those that interact with databases: Authentication
- `rabbitmq_network`: Those that interact with RabbitMQ pipelines.

