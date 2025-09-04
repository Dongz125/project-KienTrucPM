import os
import pika
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic, BasicProperties
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    pipeline,
)
import threading
import torch
import json


def on_message_callback_weehoo(
    channel: BlockingChannel,
    method: Basic.Deliver,
    properties: BasicProperties,
    body: bytes,
) -> None:
    """
    Callback function for processing received messages.
    """
    msg = json.JSONDecoder().decode(body.decode())
    print(msg)
    channel.basic_ack()


class AnalyzerState:
    def __init__(self, model_name: str = "ProsusAI/finbert"):
        self.model_name = model_name
        self.device = 0 if torch.cuda.is_available() else -1

        # load tokenizer + model explicitly (safer than passing model name only)
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)

        # create pipeline — use top_k=None to get scores for all labels
        # (some transformers versions deprecate return_all_scores; top_k=None is the stable option)
        print("Setting up sentimental pipeline")
        self.sentiment_pipeline = pipeline(
            task="text-classification",
            model=self.model,
            tokenizer=self.tokenizer,
            device=self.device,
        )

        self._connect()

    def _connect(self):
        print(
            "Connecting to RabbitMQ", os.getenv("RABBITMQ_URL"), os.getenv("QUEUE_NAME")
        )
        self.rabbitmq_url = str(os.getenv("RABBITMQ_URL"))
        self.queue_name = str(os.getenv("QUEUE_NAME"))
        params = pika.URLParameters(self.rabbitmq_url)
        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue_name, durable=True)

        # bind the instance method as the callback
        self.channel.basic_consume(
            queue=self.queue_name,
            auto_ack=True,
            on_message_callback=on_message_callback_weehoo,
        )

    def _start_thread(self):
        # Just to make sure it doesn't block the main thread
        t = threading.Thread(target=self._consume, daemon=True)
        t.start()

    def _consume(self):
        """This will block, but only inside the thread."""
        try:
            print("Sentiment Analysis Listening")
            self.channel.start_consuming()
            print("This should never print")
        except Exception as e:
            print("Consumer stopped:", e)

    def is_running(self) -> bool:
        queue = self.channel.queue_declare(queue=self.queue_name, passive=True)
        message_count = queue.method.message_count
        return message_count > 0

    def close(self):
        self.connection.close()
