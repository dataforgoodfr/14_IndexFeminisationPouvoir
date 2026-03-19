"""
Lance tous les spiders du projet avec sauvegarde des fichiers CSV dans le dossier data
TODO: exporter les sorties dans S3, configurer le logging et refactorer la production des settings
"""
import os
import logging
from scrapy.utils.project import get_project_settings
from scrapy.crawler import AsyncCrawlerProcess
from scrapy.spiderloader import SpiderLoader
from scrapy.utils.log import configure_logging


def run_all():
    """
    Lance tous les spiders du projet avec sauvegarde des fichiers CSV dans le dossier data
    """
    settings = get_project_settings()

    configure_logging(settings)
    logger = logging.getLogger(__name__)

    data_dir = os.path.join(os.getcwd(), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    spider_loader = SpiderLoader.from_settings(settings)
    spiders = spider_loader.list()
    # spiders = ["figure2c"]
    process = AsyncCrawlerProcess(settings)

    for spider_name in spiders:
        # 1. On récupère la CLASSE du spider
        spider_cls = spider_loader.load(spider_name)

        # 2. On récupère les réglages déjà existants sur la classe (Playwright, etc.)
        # Si le spider n'en a pas, on part d'un dictionnaire vide
        existing_settings = getattr(spider_cls, "custom_settings", {}) or {}

        # 3. On prépare nos réglages de sortie
        new_feeds = {
            "FEEDS": {
                f"file://{data_dir}/%(name)s_%(time)s.csv": {
                    "format": "csv",
                    "encoding": "utf8",
                }
            }
        }

        # 4. FUSION : On garde l'ancien et on ajoute le nouveau
        # .copy() évite de modifier accidentellement d'autres références
        updated_settings = existing_settings.copy()
        updated_settings.update(new_feeds)

        # 5. On réaffecte le dictionnaire complet à la classe
        spider_cls.custom_settings = updated_settings

        logger.info(
            f"📍 Configuration fusionnée pour {spider_name} (Playwright préservé)"
        )
        process.crawl(spider_cls)

    logger.info("🚀 Démarrage du processus Scrapy...")
    process.start()


if __name__ == "__main__":
    run_all()
