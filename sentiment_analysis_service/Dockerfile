FROM python:3.13-slim

WORKDIR /app
RUN apt-get update && apt-get install -y curl
RUN pip install --no-cache-dir uv
ENV PATH="/root/.cargo/bin:${PATH}"

COPY requirements.txt ./
RUN uv venv && uv pip install -n -r requirements.txt

COPY . .

CMD ["uv", "run", "src/main.py"]
