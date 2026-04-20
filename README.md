# Template DataForGood

This file will become your README and also the index of your
documentation.

# Contributing

# Structure du projet

Le projet est structuré comme suit:
```
├── .github/                             <--- Les workflows de CI/CD GitHub Actions
├── dbt_ifp/                             <--- La partie BD
├── docker/                              <--- Les fichiers Docker
├── nextjs/                              <--- La partie front-end
├── scrapers/                            <--- Les scrapers
├── docker-compose.yml                   <--- Le fichier de construction des conteneurs Docker
├── pyproject.toml                       <--- Le fichier de configuration de Python (scrapers)
```
# Structures des sous-projets

## Scrapers
Voir le fichier [README](./scrapers/README.md) du sous-projet `scrapers`.