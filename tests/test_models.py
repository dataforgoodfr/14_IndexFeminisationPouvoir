import pytest
from pathlib import Path
from pydantic import ValidationError

# Adaptez cet import au chemin exact de votre projet
from scrapers_ifp.scrapers_ifp.models import Personne


# Tests paramétrés sur le parsing des noms ---

@pytest.mark.parametrize(
    "nom_brut, expected_civilite, expected_prenom, expected_nom, expected_genre",
    [
        # Cas standard femme
        ("Mme Nadège Abomangoli", "Mme", "Nadège", "Abomangoli", "F"),
        # Cas avec point et prénom composé
        ("M. Jean-Luc Mélenchon", "M.", "Jean-Luc", "Mélenchon", "M"),
        # Cas femme avec "Madame"
        ("Madame Yaël Braun-Pivet", "Madame", "Yaël", "Braun-Pivet", "F"),
        # Cas avec des espaces inutiles (pour vérifier le .strip())
        ("   M. Gabriel Attal   ", "M.", "Gabriel", "Attal", "M"),
        # Cas sans civilité (genre inconnu -> U)
        ("Emmanuel Macron", "", "Emmanuel", "Macron", "U"),
        # Cas avec particule (pour tester vos ajouts fr_prefixes)
        ("M. Charles de Gaulle", "M.", "Charles", "de Gaulle", "M"),
    ]
)
def test_decoupage_personne_nameparser(nom_brut, expected_civilite, expected_prenom, expected_nom, expected_genre):
    """Vérifie que le validateur Pydantic découpe bien les noms et déduit le bon genre."""

    # On instancie notre modèle avec le seul champ obligatoire
    item = Personne(personne_raw_text=nom_brut)

    # On vérifie que Nameparser a fait son travail
    assert item.personne_civilite == expected_civilite
    assert item.personne_prenom == expected_prenom
    assert item.personne_nom == expected_nom

    # On vérifie votre logique métier (genre_from_civilite)
    assert item.personne_genre == expected_genre

    # On s'assure que le texte complet a bien été nettoyé
    assert item.personne_nom_complet == nom_brut.strip()


# Tests sur les erreurs de validation (Les crashs) ---

def test_erreur_si_texte_brut_manquant():
    """Vérifie que Pydantic plante si on oublie 'personne_raw_text'."""

    with pytest.raises(ValidationError) as error_info:
        # On essaie de créer un objet en omettant le champ texte
        Personne(personne_nom="Macron")

    assert "personne_raw_text" in str(error_info.value)


def test_erreur_si_genre_invalide():
    """Vérifie que votre @field_validator bloque bien les genres hors de ALLOWED_GENRES."""

    with pytest.raises(ValidationError) as error_info:
        # On passe délibérément un genre "Z" pour forcer l'erreur
        Personne(personne_raw_text="M. Test", personne_genre="Z")

    message_erreur = str(error_info.value)
    # On vérifie que votre message d'erreur personnalisé est bien remonté
    assert "Le genre 'Z' n'est pas autorisé" in message_erreur