import pytest
import sys
import os

# Ajout du chemin pour importer run_all_scrapers
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../scrapers_ifp"))
)

from scrapers.scrapers_ifp.run_all_scrapers import parse_arguments, run_all


import scrapy


class MockSpider(scrapy.Spider):
    name = "mock_spider"
    custom_settings = None


def test_run_all_configures_feeds_local(mocker):
    """Vérifie que run_all configure bien les FEEDS locaux"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "local"])

    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["mock_spider"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.AsyncCrawlerProcess",
        return_value=mock_process,
    )

    # Mock de configure_logging pour éviter les effets de bord
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.configure_logging")

    # On empêche le démarrage réel du process
    mock_process.start.return_value = None

    run_all()

    # Vérification des settings du spider
    feeds = MockSpider.custom_settings.get("FEEDS")
    assert feeds is not None
    # On vérifie qu'il y a une clé file://
    assert any(k.startswith("file://") for k in feeds.keys())
    assert not any(k.startswith("s3://") for k in feeds.keys())


def test_run_all_configures_feeds_s3(mocker):
    """Vérifie que run_all configure bien les FEEDS S3"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "s3"])

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
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.load_dotenv")

    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["mock_spider"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.AsyncCrawlerProcess",
        return_value=mock_process,
    )
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.configure_logging")

    # On empêche le démarrage réel du process
    mock_process.start.return_value = None

    run_all()

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


def test_run_all_configures_feeds_both(mocker):
    """Vérifie que run_all configure bien les FEEDS local et S3"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "both"])

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
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.load_dotenv")

    # Mock de SpiderLoader
    mock_loader = mocker.Mock()
    mock_loader.list.return_value = ["mock_spider"]
    mock_loader.load.return_value = MockSpider
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.SpiderLoader.from_settings",
        return_value=mock_loader,
    )

    # Mock de AsyncCrawlerProcess
    mock_process = mocker.Mock()
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.AsyncCrawlerProcess",
        return_value=mock_process,
    )
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.configure_logging")

    # On empêche le démarrage réel du process
    mock_process.start.return_value = None

    run_all()

    # Vérification des settings du spider
    feeds = MockSpider.custom_settings.get("FEEDS")
    assert feeds is not None
    assert any(k.startswith("file://") for k in feeds.keys())
    assert any(k.startswith("s3://test_bucket/") for k in feeds.keys())


def test_parse_arguments_default(mocker):
    """Teste les arguments par défaut (local)"""
    mocker.patch("sys.argv", ["run_all_scrapers.py"])
    args = parse_arguments()
    assert args.storage == "local"


def test_parse_arguments_storage_local(mocker):
    """Teste l'argument --storage local"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "local"])
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
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "s3"])
    mocker.patch(
        "os.getenv", side_effect=lambda key, default=None: mock_env.get(key, default)
    )
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.load_dotenv"
    )  # Adapter le chemin d'import

    args = parse_arguments()
    assert args.storage == "s3"


def test_parse_arguments_storage_s3_failure(mocker):
    """Teste l'argument --storage s3 avec des variables d'environnement manquantes"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "s3"])
    mocker.patch("os.getenv", return_value=None)
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.load_dotenv")
    mock_exit = mocker.patch("sys.exit")

    parse_arguments()

    # L'assertion reste très similaire
    mock_exit.assert_called_once_with(1)


def test_parse_arguments_invalid_storage(mocker):
    """Teste un argument cible invalide"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--storage", "invalid"])
    mocker.patch("sys.stderr")  # On mocke stderr pour ne pas polluer la console

    with pytest.raises(SystemExit):
        parse_arguments()
