import json
import requests

# Ruta del archivo generado por tu scraper
JSON_FILE = "carreras_uc_detalle.json"

# URL del endpoint Express
API_URL = "http://localhost:4000/api/carreras/bulk"  # Cambia puerto si es distinto


def cargar_carreras_desde_archivo(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def enviar_carreras_al_backend(carreras):
    try:
        response = requests.post(API_URL, json=carreras)
        if response.status_code == 201:
            print(f"✅ {len(carreras)} carreras insertadas correctamente.")
        else:
            print(f"⚠️ Error al insertar: {response.status_code}")
            print(response.json())
    except Exception as e:
        print("❌ Error al conectar con la API:", e)


if __name__ == "__main__":
    print("📦 Cargando archivo JSON...")
    carreras = cargar_carreras_desde_archivo(JSON_FILE)

    if not isinstance(carreras, list):
        print("❌ El archivo debe contener un array de carreras.")
    else:
        print(f"🚀 Enviando {len(carreras)} carreras al backend...")
        # ? Falta agregar áreas a las carreras
        for carrera in carreras:
            carrera["area"] = "No indicada"
            print(carrera)
        enviar_carreras_al_backend(carreras)
