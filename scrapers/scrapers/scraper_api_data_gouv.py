# Packages
import requests
import json
import pandas as pd

# Création du dictionnaire de correspondance donnée --> id_ressource
dict_corresp_data_id = {
    "deputees": "1ac42ff4-1336-44f8-a221-832039dbc142",
    "conseilleres_departementales": "601ef073-d986-4582-8e1a-ed14dc857fba",
    "conseilleres_regionales": "430e13f9-834b-4411-a1a8-da0b4b6e715c",
    "senatrices": "b78f8945-509f-4609-a4a7-3048b8370479",
    "maires": "2876a346-d50c-4911-934e-19ee07b0e503"
}

nb_pages = 2
page_size = 200
data = "deputees"


def recuperer_data_api(nb_pages):
    df_final = pd.DataFrame()

    for page in range(1, nb_pages + 1):
        pattern_url = f"https://tabular-api.data.gouv.fr/api/resources/{dict_corresp_data_id[data]}/data/?page={page}&page_size={page_size}"
        
        # Détermination de l'URL en fonction de la page et de la taille de page
        URL_PAGE = pattern_url.format(page=page, page_size=page_size)
        print(URL_PAGE)

        # Requête
        response = requests.get(
                url = URL_PAGE,
                timeout=20
                )
        
        if response.status_code == 200:
            try:
                resultat_api = json.loads(response.text)
            except json.JSONDecodeError as exc:
                print("Impossible de décoder le JSON :", exc)
                raise

        resultat_temp = resultat_api['data']
        resultat_temp = pd.DataFrame(resultat_temp)
        df_final = pd.concat([df_final, resultat_temp], ignore_index=True)

        return df_final
    

df_final = recuperer_data_api(nb_pages=2)

print(df_final.head)
