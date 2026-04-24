import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from update_pouvoir import (
    compute_score,
    compute_evolution,
    patch_composante,
    sync_collectivites,
)


def test_compute_score_rounds_to_one_decimal():
    assert compute_score(16, 36) == 44.4


def test_compute_score_zero_women():
    assert compute_score(0, 10) == 0.0


def test_compute_score_all_women():
    assert compute_score(5, 5) == 100.0


def test_compute_evolution_negative():
    assert compute_evolution(44.4, 50.0) == -5.6


def test_compute_evolution_positive():
    assert compute_evolution(55.0, 50.0) == 5.0


def test_patch_composante_updates_score_evolution_annee():
    data = {
        "executif": {
            "composantes": {
                "gouvernement": {"score": 50.0, "evolution": 2.5, "annee": 2025}
            }
        }
    }
    patch_composante(data, ["executif", "composantes", "gouvernement"], 44.4, -5.6)
    node = data["executif"]["composantes"]["gouvernement"]
    assert node["score"] == 44.4
    assert node["evolution"] == -5.6
    assert node["annee"] == 2026


def test_patch_composante_leaves_other_fields_intact():
    data = {
        "executif": {
            "composantes": {
                "gouvernement": {
                    "score": 50.0,
                    "annee": 2025,
                    "description": "keep me",
                }
            }
        }
    }
    patch_composante(data, ["executif", "composantes", "gouvernement"], 44.4, -5.6)
    assert data["executif"]["composantes"]["gouvernement"]["description"] == "keep me"


def test_sync_collectivites_updates_matching_stat():
    data = {
        "local": {
            "collectivites": [
                {
                    "titre": "Régions",
                    "stats": [
                        {"valeur": 29.4, "role": "présidant une région"},
                        {"valeur": 25.0, "role": "directrices de cabinet"},
                    ],
                }
            ]
        }
    }
    sync_collectivites(data, "presidentesRegion", 31.2)
    assert data["local"]["collectivites"][0]["stats"][0]["valeur"] == 31.2


def test_sync_collectivites_does_not_update_other_stats():
    data = {
        "local": {
            "collectivites": [
                {
                    "titre": "Régions",
                    "stats": [
                        {"valeur": 29.4},
                        {"valeur": 25.0},
                    ],
                }
            ]
        }
    }
    sync_collectivites(data, "presidentesRegion", 31.2)
    assert data["local"]["collectivites"][0]["stats"][1]["valeur"] == 25.0


def test_sync_collectivites_ignores_unknown_key():
    data = {"local": {"collectivites": []}}
    sync_collectivites(data, "unknown_composante_key", 50.0)  # must not raise
