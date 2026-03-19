import pytest
import sys
from unittest.mock import patch, MagicMock
import os

# Ajout du chemin pour importer run_all_scrapers
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../scrapers_ifp"))
)

from scrapers.scrapers_ifp.run_all_scrapers import parse_arguments


def test_parse_arguments_default():
    """Teste les arguments par défaut (local)"""
    with patch("sys.argv", ["run_all_scrapers.py"]):
        args = parse_arguments()
        assert args.target == "local"


def test_parse_arguments_target_local():
    """Teste l'argument --target local"""
    with patch("sys.argv", ["run_all_scrapers.py", "--target", "local"]):
        args = parse_arguments()
        assert args.target == "local"


def test_parse_arguments_target_s3_success():
    """Teste l'argument --target s3 avec les variables d'environnement présentes"""
    mock_env = {
        "S3_ACCESS_KEY": "test_key",
        "S3_SECRET_ACCESS_KEY": "test_secret",
        "S3_REGION": "test_region",
        "S3_ENDPOINT_URL": "test_url",
        "S3_BUCKET_NAME": "test_bucket",
    }
    with patch("sys.argv", ["run_all_scrapers.py", "--target", "s3"]):
        with patch(
            "os.getenv",
            side_effect=lambda key, default=None: mock_env.get(key, default),
        ):
            with patch("run_all_scrapers.load_dotenv"):
                args = parse_arguments()
                assert args.target == "s3"


def test_parse_arguments_target_s3_failure():
    """Teste l'argument --target s3 avec des variables d'environnement manquantes"""
    # On mocke os.getenv pour qu'il retourne None pour les clés S3
    with patch("sys.argv", ["run_all_scrapers.py", "--target", "s3"]):
        with patch("os.getenv", return_value=None):
            with patch("run_all_scrapers.load_dotenv"):
                with patch("sys.exit") as mock_exit:
                    parse_arguments()
                    mock_exit.assert_called_once_with(1)


def test_parse_arguments_target_both_success():
    """Teste l'argument --target both avec les variables d'environnement présentes"""
    mock_env = {
        "S3_ACCESS_KEY": "test_key",
        "S3_SECRET_ACCESS_KEY": "test_secret",
        "S3_REGION": "test_region",
        "S3_ENDPOINT_URL": "test_url",
        "S3_BUCKET_NAME": "test_bucket",
    }
    with patch("sys.argv", ["run_all_scrapers.py", "--target", "both"]):
        with patch(
            "os.getenv",
            side_effect=lambda key, default=None: mock_env.get(key, default),
        ):
            with patch("run_all_scrapers.load_dotenv"):
                args = parse_arguments()
                assert args.target == "both"


def test_parse_arguments_invalid_target():
    """Teste un argument cible invalide (argparse devrait lever une erreur ou quitter)"""
    with patch("sys.argv", ["run_all_scrapers.py", "--target", "invalid"]):
        # argparse appelle sys.exit par défaut en cas d'erreur d'argument
        with patch("sys.stderr", new=MagicMock()):  # Silencing stderr for clean output
            with pytest.raises(SystemExit):
                parse_arguments()
