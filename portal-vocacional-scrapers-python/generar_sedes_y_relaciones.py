import json

# Leer archivo con detalles de carreras
with open("carreras_uc_detalle.json", "r", encoding="utf-8") as f:
    carreras = json.load(f)

# =========================
# 1. Extraer sedes únicas
# =========================

sedes_dict = {}
sede_id_counter = 1

for carrera in carreras:
    sede = carrera.get("sede")
    if sede:
        clave = (sede["campus"].strip(), sede["direccion"].strip())
        if clave not in sedes_dict:
            sedes_dict[clave] = {
                "id": sede_id_counter,
                "campus": sede["campus"].strip(),
                "direccion": sede["direccion"].strip()
            }
            sede_id_counter += 1

sedes = list(sedes_dict.values())
print(f"✅ {len(sedes)} sedes únicas encontradas.")

# =========================
# 2. Generar relaciones SedeCarrera
# =========================

relaciones = []
carrera_id_counter = 1  # ⚠️ Reemplaza por IDs reales si los tienes

for carrera in carreras:
    sede = carrera.get("sede")
    if not sede:
        continue

    clave = (sede["campus"].strip(), sede["direccion"].strip())
    sede_id = sedes_dict[clave]["id"]

    relaciones.append({
        # Puedes mapear por nombre si tienes los ID reales
        "idCarrera": carrera_id_counter,
        "idSede": sede_id,
        "jornada": "Diurna",  # Si el sitio no da más info, se puede asumir esto por defecto
        "arancel": carrera.get("arancel"),
        "puntajeCorte": carrera.get("puntaje_ultimo"),
        "cuposPace": carrera.get("vacantes"),
        "enlace": carrera.get("link")
    })

    carrera_id_counter += 1

# =========================
# 3. Guardar los resultados
# =========================

with open("sedes_uc.json", "w", encoding="utf-8") as f:
    json.dump(sedes, f, ensure_ascii=False, indent=2)

with open("relaciones_sede_carrera.json", "w", encoding="utf-8") as f:
    json.dump(relaciones, f, ensure_ascii=False, indent=2)

print("📁 Archivos guardados: sedes_uc.json y relaciones_sede_carrera.json")
