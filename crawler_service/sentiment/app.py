from pymongo import MongoClient
from transformers import pipeline

MONGO_URI = "mongodb://mongo:27017"   # trong docker-compose nó connect được mongo container
DB_NAME = "finance_app"
RAW_COLLECTION = "raw_posts"
ANALYZED_COLLECTION = "analyzed_posts"

# Load FinBERT (model chuyên tài chính)
print("⏳ Loading FinBERT model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")
print("✅ Model loaded")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
raw_col = db[RAW_COLLECTION]
analyzed_col = db[ANALYZED_COLLECTION]

def analyze_new_posts():
    new_posts = raw_col.find({"analyzed": {"$ne": True}})
    for post in new_posts:
        try:
            result = sentiment_pipeline(post["body"])[0]
            sentiment_data = {
                "id": post["id"],
                "source": post.get("source"),
                "title": post.get("title"),
                "body": post["body"],
                "user": post.get("user"),
                "sentiment": result["label"],
                "score": float(result["score"]),
                "created_at": post["created_at"]
            }
            analyzed_col.update_one({"id": post["id"]}, {"$set": sentiment_data}, upsert=True)
            raw_col.update_one({"id": post["id"]}, {"$set": {"analyzed": True}})
            print(f"✅ Post {post['id']} → {result['label']} ({result['score']:.2f})")
        except Exception as e:
            print(f"⚠️ Error analyzing post {post['id']}: {e}")

if __name__ == "__main__":
    analyze_new_posts()
