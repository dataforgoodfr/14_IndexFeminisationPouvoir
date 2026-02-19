# Pour faire fonctionner le scraper `scrapy`

Ce (court) document fournit les instructions d'installation, la configuration de l'environnement, ainsi que le code source des principaux composants (Modèles, Spiders, Tests) pour faire fonctionner un premier scraper, correspondant à la figure 2c.

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

Dans le répertoire `14_IndexFeminisationPouvoir/scrapers_ifp`, lancer la commande

`uv run scrapy crawl -O ./data/raw/figure2c.jl figure2c`

**Vous obtiendrez les premières sorties !** Et si vous préférez des sorties en `csv`:commande

`uv run scrapy crawl -O ./data/raw/figure2c.csv figure2c`

## Il y a aussi des tests automatiques `pytest`

Vous pouvez les lancer par
`uv run pytest -v ./tests` depuis le répertoire racine du repo.


# Remarques
- Il pourrait-être intéressant d'utiliser Docker pour développer. À discuter en réunion projet.



