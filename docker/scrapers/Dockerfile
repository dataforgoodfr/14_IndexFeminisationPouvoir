FROM python:3.14-slim

WORKDIR /app

COPY scrapers/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY scrapers/ /scrapers

#CMD ["python", "main.py"]

