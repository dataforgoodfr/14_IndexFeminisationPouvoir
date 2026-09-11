FROM python:3.12-slim

RUN pip install uv

WORKDIR /app

# 1) Copier pyproject + lock AVANT TOUT
COPY pyproject.toml uv.lock ./

# 2) Installer les deps du projet
RUN uv sync --no-cache --frozen

# 3) Copier le code
COPY ifp_sources/ ifp_sources/

# 4) Installer les deps liées au code (scrapy, sqlalchemy…)
RUN uv sync

RUN uv sync

ENV VIRTUAL_ENV=/app/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

CMD ["python", "ifp_sources/extract_and_export.py"]

