import pytest
import sys
import os

# Ajout du chemin pour importer run_all_scrapers
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../scrapers_ifp"))
)

from scrapers.scrapers_ifp.run_all_scrapers import parse_arguments


def test_parse_arguments_default(mocker):
    """Teste les arguments par défaut (local)"""
    mocker.patch("sys.argv", ["run_all_scrapers.py"])
    args = parse_arguments()
    assert args.target == "local"


def test_parse_arguments_target_local(mocker):
    """Teste l'argument --target local"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--target", "local"])
    args = parse_arguments()
    assert args.target == "local"


def test_parse_arguments_target_s3_success(mocker):
    """Teste l'argument --target s3 avec les variables d'environnement présentes"""
    mock_env = {
        "S3_ACCESS_KEY": "test_key",
        "S3_SECRET_ACCESS_KEY": "test_secret",
        "S3_REGION": "test_region",
        "S3_BUCKET_NAME": "test_bucket",
        "S3_ENDPOINT_URL": "test_url",
    }

    # On patche tout à la suite, de manière linéaire
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--target", "s3"])
    mocker.patch(
        "os.getenv", side_effect=lambda key, default=None: mock_env.get(key, default)
    )
    mocker.patch(
        "scrapers.scrapers_ifp.run_all_scrapers.load_dotenv"
    )  # Adapter le chemin d'import

    args = parse_arguments()
    assert args.target == "s3"


def test_parse_arguments_target_s3_failure(mocker):
    """Teste l'argument --target s3 avec des variables d'environnement manquantes"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--target", "s3"])
    mocker.patch("os.getenv", return_value=None)
    mocker.patch("scrapers.scrapers_ifp.run_all_scrapers.load_dotenv")
    mock_exit = mocker.patch("sys.exit")

    parse_arguments()

    # L'assertion reste très similaire
    mock_exit.assert_called_once_with(1)


def test_parse_arguments_invalid_target(mocker):
    """Teste un argument cible invalide"""
    mocker.patch("sys.argv", ["run_all_scrapers.py", "--target", "invalid"])
    mocker.patch("sys.stderr")  # On mocke stderr pour ne pas polluer la console

    with pytest.raises(SystemExit):
        parse_arguments()
