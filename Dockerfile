FROM python:3.12-slim

RUN pip install --upgrade pip && \
    pip install uvicorn fastapi

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/


WORKDIR /app


RUN apt-get update && apt-get install -y


COPY . /app

RUN uv sync
RUN uv pip freeze > requirements.txt
RUN uv pip install -r requirements.txt --system

EXPOSE 80

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
