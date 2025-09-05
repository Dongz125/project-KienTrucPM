import os
import pika
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic, BasicProperties
from pika.frame import Method
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    pipeline,
)
import threading
import torch
import json
import time
from pymongo.collection import Collection


class AnalyzerState:
    channel: BlockingChannel
    model_name: str
    device: int
    col: Collection

    def __init__(self, col: Collection):
        self.model_name = "ProsusAI/finBERT"
        self.device = 0 if torch.cuda.is_available() else -1
        self.col = col

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
            on_message_callback=self.on_message_callback_weehoo,
            auto_ack=True,
        )

    def on_message_callback_weehoo(
        self,
        channel: BlockingChannel,
        method: Basic.Deliver,
        properties: BasicProperties,
        body: bytes,
    ) -> None:
        """
        Callback function for processing received messages.
        """
        try:
            messages: list[dict] = json.loads(body.decode("utf-8"))

            # Iterate through each message (node) in the list
            inserters = []
            for node in messages:
                # Extract the content from the message, assuming it's a dictionary
                message_content = node.get("content", "")

                if message_content:
                    # Use the sentiment pipeline on the message content
                    results = self.sentiment_pipeline(message_content)

                    # Print the results
                    print(f"Message: '{message_content}'")
                    print(f"Sentiment Analysis Results: {results}")
                    inserters.append(
                        {
                            "content": message_content,
                            "sentiment": results,
                            "timestamp": time.time(),
                        }
                    )

            print(self.col.insert_many(inserters))

        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON from message body: {e}")
        except Exception as e:
            print(f"An error occurred during sentiment analysis: {e}")

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

    def query_status(self) -> dict:
        queue: Method = self.channel.queue_declare(queue=self.queue_name)
        return {"count": queue.method.message_count}

    def close(self):
        self.connection.close()
