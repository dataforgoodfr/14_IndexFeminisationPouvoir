# Module Scrapers - Index de Féminisation du Pouvoir

Ce répertoire contient l'ensemble des outils de collecte de données nécessaires à l'alimentation de l'Index de
Féminisation du Pouvoir. La logique de scraping est centralisée ici pour permettre une exécution isolée et
reproductible.

## Architecture et utilisation de Scrapy

Le projet s'appuie sur le framework Python **Scrapy**, qui permet d'extraire de manière structurée et asynchrone les
informations depuis diverses sources web.

Si vous n'êtes pas familier avec Scrapy, vous pouvez consulter la documentation
officielle à l'adresse suivante : [Scrapy Documentation](https://docs.scrapy.org/en/latest/), et suivre le tutoriel
[Scrapy Tutorial](https://docs.scrapy.org/en/latest/intro/tutorial.html).

L'arborescence du répertoire est organisée comme suit :

* **scrapers_ifp/** : Contient le cœur du bot Scrapy, incluant les spiders (scripts d'extraction), les items (définition
  des données), les pipelines (traitement post-extraction) et les paramètres de configuration.
* **tests/** : Regroupe l'ensemble des tests unitaires et d'intégration validant le comportement du code, notamment pour
  l'orchestrateur et les spiders.
* **run_spiders.py** : Script principal servant d'orchestrateur pour lancer, filtrer et configurer le stockage des
  différents spiders.
* **scrapy.cfg** : Fichier de configuration standard requis par l'outil en ligne de commande Scrapy.

## Gestion des dépendances avec uv

Le projet utilise [uv](https://docs.astral.sh/uv/), un gestionnaire de paquets et d'environnements virtuels Python.

Dans les commandes d'exécution (notamment via Docker), vous remarquerez l'utilisation systématique du préfixe `uv run`.
Cela permet de s'assurer que le code (que ce soient les tests ou les scrapers) est exécuté de manière sécurisée et
isolée, en s'appuyant très exactement sur les versions des bibliothèques définies dans le projet, sans risque de
conflit.

## Utilisation de Docker

Pour garantir un environnement de développement et d'exécution constant, l'utilisation de Docker est fortement
recommandée.

Si Docker n'est pas encore présent sur votre machine, veuillez suivre
la [procédure officielle d'installation de Docker](https://docs.docker.com/get-docker/).

Pour construire l'image du conteneur (le build), placez-vous à la racine globale du projet (le répertoire parent qui
contient le dossier scrapers) et exécutez la commande suivante :

    docker compose build scrapers

Pour lancer la suite de tests Pytest à l'intérieur du conteneur, placez-vous également à la racine du projet et utilisez
cette commande :

    docker compose run --rm -w /app/scrapers -e PYTHONPATH=/app/scrapers scrapers uv run pytest -m "not live" -v

Pour exécuter les scrapers via l'orchestrateur run_spiders.py, lancez la commande de base suivante depuis la racine du
projet :

    docker compose run --rm -w /app/scrapers -e PYTHONPATH=/app scrapers uv run python run_spiders.py

Cette commande accepte plusieurs options pour personnaliser l'exécution :

* -`-storage local`, `--storage s3` ou `--storage both` : Définit la destination de sauvegarde des fichiers CSV générés
  (en local dans le dossier data, sur AWS S3, ou sur les deux). Le stockage par défaut est local.
* `--spiders spider1 spider2` : Permet de cibler et de lancer uniquement une liste de spiders spécifiques.
* `--all-spiders` : Indique s'il faut lancer l'intégralité des spiders disponibles (activé par défaut).
  C'est l'option par défaut.

Lors du développement et de la mise au point d'un spider, il est recommandé de lancer un scraper
spécifique avec des sorties de données locales en utilisant la commande:

```aiignore
    docker compose run --rm -w /app/scrapers \
          -e PYTHONPATH=/app scrapers uv run python run_spiders.py \
          --storage local --spiders my_spider_name
```

Les sorties se trouvent dans le dossier `scrapers/scrapers_ifp/data`.

## Qualité et livraison de code

Afin de maintenir une base de code saine et de garantir l'intégrité des données collectées, des vérifications
doivent-être effectuées avant toute livraison de code (Pull Request).

Il est nécessaire d'utiliser les outils de **pre-commit** en local avant de soumettre vos modifications. Ces outils se
chargent de formater le code et de vérifier sa conformité avec les standards du projet.

Vous devez aussi lancer l'ensemble des tests **pytest** (via la commande Docker indiquée
précédemment). Le code livré doit passer ces tests avec succès. Aucune modification ne pourra être fusionnée si la suite
de tests présente des erreurs.