import pytest
import json
from scrapy.http import TextResponse, Request
from scrapers.scrapers_ifp.scrapers_ifp.spiders.rne_spider import (
    RneDeputesSpider,
    RneConseillersDepartementauxSpider,
)


# --- FIXTURES ---


@pytest.fixture
def mock_catalog_response():
    """Simule la réponse JSON du catalogue data.gouv.fr."""
    body = json.dumps(
        {
            "resources": [
                {"title": "elus-deputes-dep.csv", "id": "ID-DEPUTES-123"},
                {"title": "elus-conseillers-departementaux.csv", "id": "ID-DEPT-456"},
            ]
        }
    )
    return TextResponse(
        url="https://www.data.gouv.fr/api/1/datasets/repertoire-national-des-elus-1/",
        request=Request("https://www.data.gouv.fr/"),
        body=body,
        encoding="utf-8",
    )


@pytest.fixture
def mock_tabular_data():
    """Simule une page de données provenant de l'API Tabulaire."""
    body = json.dumps(
        {
            "data": [
                {
                    "Nom": "Jean Test",
                    "Libellé de la fonction": "Président du conseil départemental",
                },
                {
                    "Nom": "Claire Exemple",
                    "Libellé de la fonction": "Conseiller départemental",
                },
            ],
            "links": {"next": "https://tabular-api.fr/next-page"},
        }
    )
    return TextResponse(
        url="https://tabular-api.data.gouv.fr/api/resources/ID-TEST/data/",
        request=Request("https://tabular-api.data.gouv.fr/"),
        body=body,
        encoding="utf-8",
    )


# --- TESTS ---


class TestRneSpiders:
    @pytest.mark.asyncio
    async def test_find_correct_resource_id(self, mock_catalog_response):
        """Vérifie que le spider extrait l'ID correspondant à son filtre (Async)."""
        spider = RneDeputesSpider()
        gen = spider.parse(mock_catalog_response)

        # On récupère le premier élément du générateur asynchrone
        request = await gen.__anext__()
        assert "ID-DEPUTES-123" in request.url
        assert request.callback == spider.parse_api_data

    def test_departmental_filter_logic(self):
        """Vérifie le filtrage (méthode synchrone)."""
        spider = RneConseillersDepartementauxSpider()
        assert (
            spider.is_row_valid(
                {"Libellé de la fonction": "Président du conseil départemental"}
            )
            is True
        )
        assert spider.is_row_valid({"Libellé de la fonction": "Conseiller"}) is False

    @pytest.mark.asyncio
    async def test_parse_api_data_content_and_source(self, mock_tabular_data):
        """Vérifie l'extraction, la pagination et la présence des données de base."""
        spider = RneDeputesSpider()
        results = []

        # Itération asynchrone sur le générateur
        async for result in spider.parse_api_data(mock_tabular_data):
            results.append(result)

        # 2 items + 1 Request de pagination
        assert len(results) == 3

        # Vérification de l'item (Traçabilité)
        item = results[0]
        assert "Nom" in item

        # Vérification de la pagination
        assert isinstance(results[-1], Request)
        assert results[-1].url == "https://tabular-api.fr/next-page"

    @pytest.mark.asyncio
    async def test_corrupted_json_handling(self, caplog):
        """Vérifie que le spider gère les erreurs de décodage JSON."""
        spider = RneDeputesSpider()
        bad_response = TextResponse(
            url="https://api.fr",
            request=Request("https://api.fr"),
            body="Not a JSON",
            encoding="utf-8",
        )

        # Selon si vous avez ajouté un try/except dans le spider ou non
        with pytest.raises((json.JSONDecodeError, ValueError)):
            async for _ in spider.parse(bad_response):
                pass

    @pytest.mark.asyncio
    async def test_missing_resource_log(self, caplog):
        """Vérifie le log d'erreur si aucune ressource ne matche (Async)."""
        spider = RneDeputesSpider()
        response = TextResponse(
            url="https://test.fr",
            request=Request("https://test.fr"),
            body=json.dumps({"resources": []}),
            encoding="utf-8",
        )

        async for _ in spider.parse(response):
            pass

        assert f"Ressource '{spider.resource_filter}' introuvable" in caplog.text
