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
