from pydantic import BaseModel, model_validator, field_validator
from typing import Optional
from nameparser import HumanName
from nameparser.config import CONSTANTS

# Ajout de titres français à nameparser
fr_titles = {'mme', 'mme.', 'madame', 'mlle', 'mlle.', 'monsieur', 'm', 'm.'}
CONSTANTS.titles.add(*fr_titles)

# Ajout de préfixes français à nameparser
fr_prefixes = {'de', 'du', 'des', 'le', 'la'}
CONSTANTS.prefixes.add(*fr_prefixes)

# Les genres autorisés sont 'M', 'F' et 'U' (inconnu)
ALLOWED_GENRES = {'M', 'F', 'U'}


def genre_from_civilite(civilite: str) -> str:
    if civilite.lower() in {'m', 'monsieur', 'm.'}:
        return 'M'
    elif civilite.lower() in {'mme', 'madame', 'mme.', 'mlle', 'mlle.'}:
        return 'F'
    else:
        return 'U'


class Personne(BaseModel):
    personne_raw_text: str
    personne_nom_complet: Optional[str] = None
    personne_civilite: Optional[str] = None
    personne_prenom: Optional[str] = None
    personne_nom: Optional[str] = None
    personne_genre: Optional[str] = None

    @field_validator('personne_genre')
    @classmethod
    def validate_genre(cls, v):
        if v not in ALLOWED_GENRES:
            raise ValueError(f"Le genre '{v}' n'est pas autorisé. Les valeurs possibles sont : {ALLOWED_GENRES}")
        return v

    @model_validator(mode='after')
    def parse_name_components(self):
        if not self.personne_raw_text: return self
        clean_text = self.personne_raw_text.strip()
        self.personne_nom_complet = clean_text
        parsed = HumanName(clean_text)
        self.personne_civilite = parsed.title
        self.personne_prenom = parsed.first
        self.personne_nom = parsed.last
        self.personne_genre = genre_from_civilite(self.personne_civilite)
        return self
