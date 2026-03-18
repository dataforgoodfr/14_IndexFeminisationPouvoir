# Les sources de données
La source de données suivante est utilisée largement pour le scraping dans [annuaire_admin_spider.py](https://github.com/dataforgoodfr/14_IndexFeminisationPouvoir/blob/f116a88d49927e4bc26af823e9f05a9d7b5b8cb0/scrapers/scrapers_ifp/scrapers_ifp/spiders/annuaire_admin_spider.py) :
- [api-lannuaire-administration](https://api-lannuaire.service-public.gouv.fr/explore/dataset/api-lannuaire-administration/information/). Une documentation succincte: [documentation succincte](https://api-lannuaire.service-public.gouv.fr/api/datasets/1.0/api-lannuaire-administration/attachments/documentation_technique_api_annuaire_de_l_administration_pdf/).

Cet autre annuaire de l'administration :
- [api-lannuaire-administration-locale-competence-geographique](https://api-lannuaire.service-public.gouv.fr/explore/dataset/api-lannuaire-administration-locale-competence-geographique/information/) avec [cette documentation](https://api-lannuaire.service-public.gouv.fr/api/datasets/1.0/api-lannuaire-administration-locale-competence-geographique/attachments/documentation_technique_api_annuaire_administration_competence_geographique_pdf/)

n'a pas été utilisé, mais pourrait-être une alternative pour certains pouvoirs locaux.

# Utilisation de Docker

Ce projet peut être exécuté localement à l’aide de Docker et Docker Compose. *Cela permet de
vous assurer que vous fonctionnez avec le même environnement que celui utilisé pour lancer
les scrapers servant aux validations d'OXFAM.*

## Prérequis

Assurez-vous d’avoir installé :

* Docker
* Docker Compose (inclus avec Docker Desktop)

Vérifiez l’installation :

```bash
docker --version
docker compose version
```

---

## Construire le conteneur pour le premier démarrage, ou après changement des dépendances

Depuis la racine du projet, exécutez :

```bash
docker compose build scrapers
```

Cette commande va :

1. Construire l’image Docker
2. Installer les dépendances

---

## Accéder au conteneur

La commande suivante démarre le conteneur en mode détaché :

```bash
docker compose up -d scrapers
```

ensuite, vous pouvez "entrer dans le conteneur" avec la commande :
```bash
docker compose exec scrapers bash
```

et lancer des commandes python comme `uv run main`

---

## Arrêter le conteneur

Lancez la commande :

```bash
docker compose down
```

---

## Nettoyage (optionnel)

Supprimer conteneurs, réseaux et volumes :

```bash
docker compose down -v
```
# Pour faire fonctionner le scraper `scrapy`

Ce (court) chapitre fournit les instructions d'installation, la configuration de l'environnement, ainsi que le code
source des principaux composants (Modèles, Spiders, Tests) pour faire fonctionner un premier scraper, correspondant à la
figure 2c.

**Pour l'instant il faut activer la branche `figure2c-scrapy-init-bureau-assemblee`**!

---

# Prérequis et Installation (`uv`)

Le projet utilise **`uv`** comme gestionnaire de paquets Python, qui est le standard pour les projets "Data for Good".

## Installer `uv`

Voir [cette URL](https://docs.astral.sh/uv/getting-started/installation/), l'installation dépendant de votre OS.

## Initialiser le projet

`uv sync`

## Installer les navigateurs Playwright

`uv run playwright install`

# Faire fonctionner le premier scaper

## Obtenir vos premières données !

Dans le répertoire `14_IndexFeminisationPouvoir/scrapers/scrapers_ifp`, lancer la commande

`uv run scrapy crawl -O ./data/raw/figure2c.jl figure2c`

**Vous obtiendrez les premières sorties!** Et si vous préférez des sorties en `csv`:commande

`uv run scrapy crawl -O ./data/raw/figure2c.csv figure2c`

## Lancer tous les scapers avec Docker

Utiliser la commande : `docker compose run --rm -w /app/scrapers/scrapers_ifp -e PYTHONPATH=/app scrapers uv run python run_spiders.py --storage local`

## Il y a aussi des tests automatiques `pytest`

Vous pouvez les lancer par
`uv run pytest -v ./tests` depuis le répertoire racine du repo.

# Remarques

Vous pouvez aussi utiliser le conteneur Docker pour lancer les scrapers et les tests automatiques.



