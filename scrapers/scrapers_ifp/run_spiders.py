"""
Lancement des spiders du projet IFP. Voir parse_arguments() pour les arguments.
"""

import argparse
import logging
from scrapy.utils.project import get_project_settings
from scrapy.crawler import AsyncCrawlerProcess
from scrapy.spiderloader import SpiderLoader
from scrapy.utils.log import configure_logging
from scrapers.scrapers_ifp.scrapers_ifp.settings_manager import (
    validate_s3_credentials,
    get_feeds_settings,
)


def parse_arguments():
    """
    Analyse les arguments de la ligne de commande et valide la configuration pour l'exportation
    des données soit localement, sur S3, ou les deux.

    Lève une erreur si le stockage inclut 's3' ou 'both' et que des variables
    d'environnement spécifiques à S3 sont manquantes.

    Arguments :
        --storage (str) : Destination des exports ('local', 's3' ou 'both').
        --all-spiders : Lance tous les spiders du projet (activé par défaut).
        --no-all-spiders : Désactive le lancement de tous les spiders.
        --spiders (list) : Liste spécifique des noms de spiders à lancer.

    Returns:
        Un objet argparse.Namespace contenant les arguments analysés.
    """

    parser = argparse.ArgumentParser(description="Orchestrateur de scrapers IFP.")
    parser.add_argument(
        "--storage",
        choices=["local", "s3", "both"],
        default="local",
        help="Destination des exports (default: local)",
    )

    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--all-spiders",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Lancer tous les spiders (défaut: True)",
    )
    group.add_argument(
        "--spiders",
        nargs="+",
        help="Liste des noms des spiders à lancer",
    )

    run_args = parser.parse_args()
    return run_args


class SpiderOrchestrator:
    """
    Orchestrateur chargé de charger, configurer et lancer les spiders Scrapy du projet IFP.

    Cette classe gère le filtrage des spiders à exécuter, la configuration dynamique
    du stockage (local, S3 ou les deux) et l'initialisation du processus de crawl.

    Attributes:
        storage (str): Type de stockage choisi ('local', 's3' ou 'both').
        target_spiders (list, optional): Liste des noms de spiders spécifiques à lancer.
        run_all (bool): Si True, lance tous les spiders disponibles si target_spiders est vide.
        settings (scrapy.settings.Settings): Paramètres Scrapy du projet.
        logger (logging.Logger): Logger configuré pour l'orchestrateur.
        spider_loader (scrapy.spiderloader.SpiderLoader): Chargeur de spiders Scrapy.
    """

    def __init__(self, storage: str, target_spiders: list = None, run_all: bool = True):
        """
        Initialise l'orchestrateur avec les paramètres de stockage et de sélection.

        Args:
            storage (str): Destination des exports ('local', 's3' ou 'both').
            target_spiders (list, optional): Liste des noms de spiders à exécuter.
            run_all (bool): Indique s'il faut lancer tous les spiders par défaut.
        """
        self.storage = storage
        self.target_spiders = target_spiders
        self.run_all = run_all
        self.settings = get_project_settings()
        self.logger = self._setup_logging()
        self.spider_loader = SpiderLoader.from_settings(self.settings)

    def _setup_logging(self):
        """
        Configure le système de logging de Scrapy.

        Returns:
            logging.Logger: Le logger configuré.
        """
        configure_logging(self.settings)
        return logging.getLogger(__name__)

    def _get_spiders_to_run(self) -> list:
        """
        Détermine la liste finale des spiders à exécuter en fonction des filtres.

        Returns:
            list: Liste des noms des spiders validés.
        """
        all_spiders = self.spider_loader.list()

        if self.target_spiders:
            # On ne garde que les spiders demandés qui existent réellement
            spiders_to_run = [s for s in self.target_spiders if s in all_spiders]
            missing_spiders = set(self.target_spiders) - set(all_spiders)
            if missing_spiders:
                self.logger.warning(
                    f"Spiders non trouvés : {', '.join(missing_spiders)}"
                )
            return spiders_to_run
        elif self.run_all:
            return all_spiders
        else:
            # Cas où --no-all-spiders est utilisé sans --spiders
            return []

    def _prepare_spider_settings(self, spider_name, spider_cls):
        """
        Fusionne les réglages de sortie spécifiques au stockage avec les réglages
        existants (custom_settings) du spider.

        Args:
            spider_name (str): Nom du spider.
            spider_cls (type): Classe du spider à configurer.
        """
        # On récupère les réglages déjà existants sur la classe (Playwright, etc.)
        # Si le spider n'en a pas, on part d'un dictionnaire vide
        existing_settings = getattr(spider_cls, "custom_settings", {}) or {}

        # On prépare nos réglages de sortie
        new_feeds = get_feeds_settings(self.storage)

        # FUSION : On garde l'ancien et on ajoute le nouveau
        # .copy() évite de modifier accidentellement d'autres références
        updated_settings = existing_settings.copy()
        updated_settings.update(new_feeds)

        # On réaffecte le dictionnaire complet à la classe
        spider_cls.custom_settings = updated_settings

        self.logger.info(
            f"Configuration fusionnée pour {spider_name} (Playwright préservé, storage: {self.storage})"
        )

    def run(self):
        """
        Lance l'exécution des spiders sélectionnés.

        Cette méthode initialise le processus de crawl, prépare les réglages de chaque
        spider et démarre le moteur de Scrapy.
        """
        spiders_to_run = self._get_spiders_to_run()

        if not spiders_to_run:
            self.logger.info("Aucun spider à lancer.")
            return

        process = AsyncCrawlerProcess(self.settings)

        for spider_name in spiders_to_run:
            # 1. On récupère la CLASSE du spider
            spider_cls = self.spider_loader.load(spider_name)

            # 2. On prépare les réglages du spider
            self._prepare_spider_settings(spider_name, spider_cls)

            # 3. On l'ajoute au processus
            process.crawl(spider_cls)

        self.logger.info("🚀 Démarrage du processus Scrapy...")
        process.start()


if __name__ == "__main__":
    args = parse_arguments()

    if args.storage in ["s3", "both"]:
        # Si ça plante ici, l'orchestrateur s'arrêtera naturellement avec l'erreur.
        validate_s3_credentials()

    orchestrator = SpiderOrchestrator(
        storage=args.storage, target_spiders=args.spiders, run_all=args.all_spiders
    )
    orchestrator.run()
