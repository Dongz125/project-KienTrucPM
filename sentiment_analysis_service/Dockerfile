FROM python:3.13-slim

WORKDIR /app
RUN apt install -y curl && curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:${PATH}"

COPY requirements.txt ./
RUN uv pip install -n -r requirements.txt

COPY . .

CMD ["uv", "run", "src/main.py"]
