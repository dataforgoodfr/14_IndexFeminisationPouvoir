FROM python:3.14-slim

WORKDIR /dbt

RUN pip install dbt-postgres

COPY dbt/ .

CMD ["dbt", "run"]

