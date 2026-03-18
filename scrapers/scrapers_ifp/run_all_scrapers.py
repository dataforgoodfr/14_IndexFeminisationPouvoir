import os
import logging
from datetime import datetime
from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess
from scrapy.spiderloader import SpiderLoader
from scrapy.utils.log import configure_logging


def run_all():
    os.environ.setdefault("SCRAPY_SETTINGS_MODULE", "scrapers_ifp.settings")
    settings = get_project_settings()

    # Forcer le reactor pour Playwright
    settings.set(
        "TWISTED_REACTOR", "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
    )

    configure_logging(settings)
    logger = logging.getLogger(__name__)

    data_dir = os.path.join(os.getcwd(), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    spider_loader = SpiderLoader.from_settings(settings)
    spiders = spider_loader.list()
    process = CrawlerProcess(settings)

    for spider_name in spiders:
        output_file = os.path.abspath(
            os.path.join(data_dir, f"{spider_name}_{timestamp}.csv")
        )

        # 1. On récupère la CLASSE du spider
        spider_cls = spider_loader.load(spider_name)

        # 2. On récupère les réglages déjà existants sur la classe (Playwright, etc.)
        # Si le spider n'en a pas, on part d'un dictionnaire vide
        existing_settings = getattr(spider_cls, "custom_settings", {}) or {}

        # 3. On prépare nos réglages de sortie
        new_feeds = {
            "FEEDS": {
                f"file://{output_file}": {
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
