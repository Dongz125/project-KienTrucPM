FROM python:3.13-slim

RUN apt-get update && apt-get install -y curl \
  && curl -LsSf https://astral.sh/uv/install.sh | sh \
  && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.local/bin:$PATH"
WORKDIR /app

COPY requirements.txt .
RUN uv venv && uv pip install -r requirements.txt

COPY . .

CMD ["uv", "run", "src/main.py"]
