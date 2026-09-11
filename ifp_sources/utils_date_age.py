from datetime import datetime


def nettoie_date(date_str: str) -> str:
    # Vide → vide
    if not date_str or date_str.strip() == "":
        return ""

    try:
        # Essayer de parser la date
        datetime.strptime(date_str, "%Y-%m-%d")
        return date_str  # valide → on garde la string
    except Exception:
        return ""  # invalide → vide


def calcul_age(date_naissance_str: str, ref_date: datetime) -> int | str:
    if not date_naissance_str or date_naissance_str.strip() == "":
        return ""

    try:
        # Essayer de parser la date
        d = datetime.strptime(date_naissance_str, "%Y-%m-%d")
    except Exception:
        return ""  # format invalide

    # Si la date de naissance est après la date de référence → invalide
    if d > ref_date:
        return ""

    # Calcul de l'âge sans modifier le DF
    age = ref_date.year - d.year - ((ref_date.month, ref_date.day) < (d.month, d.day))

    return age
