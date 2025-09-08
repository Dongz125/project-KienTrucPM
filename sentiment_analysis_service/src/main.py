from flask import Flask, jsonify
from dotenv import load_dotenv
from analyzer import AnalyzerState
from pymongo import MongoClient
from pymongo.collection import Collection
import os


app = Flask(__name__)
analyzer_state = None
collection: Collection | None = None


@app.route("/results", methods=["GET"])
def results():
    if collection is None:
        # Return an error if the database connection failed
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Find the first 100 documents in the collection
        documents = collection.find().limit(100)

        # Convert the MongoDB cursor to a list of dictionaries.
        # It's crucial to handle the "_id" field, which is a BSON ObjectId
        # and not JSON serializable. We convert it to a string.
        results_list = []
        for doc in documents:
            # Convert ObjectId to string
            doc["_id"] = str(doc["_id"])
            results_list.append(doc)

        # Use jsonify to automatically serialize the list to a JSON response
        # and set the Content-Type header to application/json.
        return jsonify(results_list), 200
    except Exception:
        return jsonify({"error": "internal server error"}), 500


@app.route("/health", methods=["GET"])
def health():
    return {"message": "Hello, World", "service": "sentiment-analysis"}, 200


@app.route("/status", methods=["GET"])
def analyzer_status():
    assert analyzer_state is not None
    service = analyzer_state
    return service.query_status(), 200


if __name__ == "__main__":
    load_dotenv()

    assert os.getenv("PORT") is not None
    assert os.getenv("RABBITMQ_URL") is not None
    assert os.getenv("MONGODB_URL") is not None
    assert os.getenv("QUEUE_NAME") is not None

    mongoclient = MongoClient(os.getenv("MONGODB_URL"))
    db = mongoclient.get_database()
    collection = db["sentiment"]

    analyzer_state = AnalyzerState(collection)
    analyzer_state._start_thread()
    print("Starting server")

    port = int(os.getenv("PORT", 3004))
    app.run(host="0.0.0.0", port=port)
