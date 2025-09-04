from flask import Flask
from dotenv import load_dotenv
from analyzer import AnalyzerState
import os


app = Flask(__name__)
analyzer_state = None


@app.route("/health", methods=["GET"])
def health():
    return {"message": "Hello, World", "service": "sentiment-analysis"}, 200


@app.route("/status", methods=["GET"])
def analyzer_status():
    assert analyzer_state is not None
    service = analyzer_state
    return {"status": "running" if service.is_running() else "idle"}, 200


if __name__ == "__main__":
    load_dotenv()

    assert os.getenv("PORT") is not None
    assert os.getenv("RABBITMQ_URL") is not None
    assert os.getenv("QUEUE_NAME") is not None

    analyzer_state = AnalyzerState()
    analyzer_state._start_thread()
    print("Starting server")

    port = int(os.getenv("PORT", 3004))
    app.run(host="0.0.0.0", port=port)
