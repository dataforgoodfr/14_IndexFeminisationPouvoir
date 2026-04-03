import sys

import pytest
import os

# Ajout du chemin pour importer run_spiders
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ..main import parse_arguments, SpiderOrchestrator
from ..settings_manager import (
    S3ConfigurationError,
    validate_s3_credentials,
)


import scrapy


class MockSpider(scrapy.Spider):
    name = "mock_spider"
    custom_settings = None


def test_orchestrator_configures_feeds_local(mocker):
    """Vérifie que l'orchestrateur configure bien les FEEDS locaux"""
    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["mock_spider"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.main.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.main.AsyncCrawlerProcess",
        return_value=mock_process,
    )

    # Mock de configure_logging pour éviter les effets de bord
    mocker.patch("scrapers.main.configure_logging")

    # On empêche le démarrage réel du process
    mock_process.start.return_value = None

    orchestrator = SpiderOrchestrator(storage="local", run_all=True)
    orchestrator.run()

    # Vérification des settings du spider
    feeds = MockSpider.custom_settings.get("FEEDS")
    assert feeds is not None
    # On vérifie qu'il y a une clé file://
    assert any(k.startswith("file://") for k in feeds.keys())
    assert not any(k.startswith("s3://") for k in feeds.keys())


def test_orchestrator_configures_feeds_s3(mocker):
    """Vérifie que l'orchestrateur configure bien les FEEDS S3"""
    mock_env = {
        "S3_ACCESS_KEY": "test_key",
        "S3_SECRET_ACCESS_KEY": "test_secret",
        "S3_REGION": "test_region",
        "S3_BUCKET_NAME": "test_bucket",
        "S3_ENDPOINT_URL": "test_url",
    }
    mocker.patch(
        "os.getenv", side_effect=lambda key, default=None: mock_env.get(key, default)
    )

    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["mock_spider"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.main.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.main.AsyncCrawlerProcess",
        return_value=mock_process,
    )
    mocker.patch("scrapers.main.configure_logging")

    # On empêche le démarrage réel du process
    mock_process.start.return_value = None

    orchestrator = SpiderOrchestrator(storage="s3", run_all=True)
    orchestrator.run()

    # Vérification des settings du spider
    feeds = MockSpider.custom_settings.get("FEEDS")
    assert feeds is not None
    assert not any(k.startswith("file://") for k in feeds.keys())
    assert any(k.startswith("s3://test_bucket/") for k in feeds.keys())

    # Vérification des variables d'environnement AWS
    assert os.environ["AWS_ACCESS_KEY_ID"] == "test_key"
    assert os.environ["AWS_SECRET_ACCESS_KEY"] == "test_secret"
    assert os.environ["AWS_ENDPOINT_URL"] == "test_url"
    assert os.environ["AWS_REGION_NAME"] == "test_region"


def test_orchestrator_configures_feeds_both(mocker):
    """Vérifie que l'orchestrateur configure bien les FEEDS local et S3"""
    mock_env = {
        "S3_ACCESS_KEY": "test_key",
        "S3_SECRET_ACCESS_KEY": "test_secret",
        "S3_REGION": "test_region",
        "S3_BUCKET_NAME": "test_bucket",
        "S3_ENDPOINT_URL": "test_url",
    }
    mocker.patch(
        "os.getenv", side_effect=lambda key, default=None: mock_env.get(key, default)
    )

    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["mock_spider"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.main.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.main.AsyncCrawlerProcess",
        return_value=mock_process,
    )
    mocker.patch("scrapers.main.configure_logging")

    # On empêche le démarrage réel du process
    mock_process.start.return_value = None

    orchestrator = SpiderOrchestrator(storage="both", run_all=True)
    orchestrator.run()

    # Vérification des settings du spider
    feeds = MockSpider.custom_settings.get("FEEDS")
    assert feeds is not None
    assert any(k.startswith("file://") for k in feeds.keys())
    assert any(k.startswith("s3://test_bucket/") for k in feeds.keys())


def test_parse_arguments_default(mocker):
    """Teste les arguments par défaut (local)"""
    mocker.patch("sys.argv", ["main.py"])
    args = parse_arguments()
    assert args.storage == "local"
    assert args.spiders is None


def test_parse_arguments_storage_local(mocker):
    """Teste l'argument --storage local"""
    mocker.patch("sys.argv", ["main.py", "--storage", "local"])
    args = parse_arguments()
    assert args.storage == "local"


def test_parse_arguments_storage_s3_success(mocker):
    """Teste l'argument --storage s3 avec les variables d'environnement présentes"""
    mock_env = {
        "S3_ACCESS_KEY": "test_key",
        "S3_SECRET_ACCESS_KEY": "test_secret",
        "S3_REGION": "test_region",
        "S3_BUCKET_NAME": "test_bucket",
        "S3_ENDPOINT_URL": "test_url",
    }

    # On patche tout à la suite, de manière linéaire
    mocker.patch("sys.argv", ["main.py", "--storage", "s3"])
    mocker.patch(
        "os.getenv", side_effect=lambda key, default=None: mock_env.get(key, default)
    )

    args = parse_arguments()
    assert args.storage == "s3"


def test_validate_s3_failure(mocker):
    """Teste validate_s3_credentials avec des variables d'environnement manquantes"""
    mocker.patch("os.getenv", return_value=None)

    with pytest.raises(S3ConfigurationError):
        validate_s3_credentials()


def test_parse_arguments_spiders_list(mocker):
    """Vérifie l'option --spiders avec une liste"""
    mocker.patch("sys.argv", ["main.py", "--spiders", "s1", "s2"])
    args = parse_arguments()
    assert args.spiders == ["s1", "s2"]


def test_parse_arguments_mutually_exclusive(mocker):
    """Vérifie l'exclusivité mutuelle entre --all-spiders et --spiders"""
    mocker.patch("sys.argv", ["main.py", "--all-spiders", "--spiders", "s1"])
    with pytest.raises(SystemExit):
        parse_arguments()


def test_orchestrator_filters_spiders(mocker):
    """Vérifie que l'orchestrateur filtre correctement les spiders"""
    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["exists", "other"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.main.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.main.AsyncCrawlerProcess",
        return_value=mock_process,
    )
    mocker.patch("scrapers.main.configure_logging")
    mock_process.start.return_value = None

    orchestrator = SpiderOrchestrator(
        storage="local", target_spiders=["exists", "missing"], run_all=False
    )
    orchestrator.run()

    # On vérifie que crawl n'a été appelé que pour "exists"
    assert mock_process.crawl.call_count == 1
    mock_loader.load.assert_called_once_with("exists")


def test_orchestrator_no_spiders_to_run(mocker):
    """Vérifie le cas où aucun spider ne doit être lancé"""
    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["s1", "s2"]
    mocker.patch(
        "scrapers.main.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.main.AsyncCrawlerProcess",
        return_value=mock_process,
    )
    mocker.patch("scrapers.main.configure_logging")

    orchestrator = SpiderOrchestrator(storage="local", run_all=False)
    orchestrator.run()

    # crawl ne doit pas être appelé
    assert mock_process.crawl.call_count == 0


def test_parse_arguments_invalid_storage(mocker):
    """Teste un argument cible invalide"""
    mocker.patch("sys.argv", ["main.py", "--storage", "invalid"])
    mocker.patch("sys.stderr")  # On mocke stderr pour ne pas polluer la console

    with pytest.raises(SystemExit):
        parse_arguments()
