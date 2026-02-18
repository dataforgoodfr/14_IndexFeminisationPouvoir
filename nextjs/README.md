# Lancer le projet avec Docker

Ce projet peut être exécuté localement à l’aide de Docker et Docker Compose.

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

## Premier démarrage

Depuis la racine du projet, exécutez :

```bash
docker compose up --build
```

Cette commande va :

1. Construire l’image Docker
2. Installer les dépendances
3. Démarrer le serveur de développement Next.js

---

## Accéder à l’application

Une fois démarrée, ouvrez :

```
http://localhost:3000
```

---

## ▶Démarrages suivants

Après le premier build :

```bash
docker compose up
```

Utilisez `--build` uniquement si vous modifiez :

* le Dockerfile
* les dépendances
* certaines variables d’environnement

```bash
docker compose up --build
```

---

## Arrêter l’application

Appuyez sur :

```
CTRL + C
```

Ou lancez :

```bash
docker compose down
```

---

## Reconstruire le conteneur

Si vous rencontrez des problèmes ou après des modifications importantes :

```bash
docker compose up --build
```

Rebuild complet sans cache :

```bash
docker compose build --no-cache
```

---

## Nettoyage (optionnel)

Supprimer conteneurs, réseaux et volumes :

```bash
docker compose down -v
```
