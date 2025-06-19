import json
import time
import re
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Configuración del navegador
options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(service=Service(
    ChromeDriverManager().install()), options=options)

# ==========================
# 1. Extraer listado de carreras
# ==========================

print("🔄 Cargando listado de carreras UC...")
driver.get("https://admision.uc.cl/carreras/")
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, ".uc-card_body"))
)
time.sleep(1)

soup = BeautifulSoup(driver.page_source, "html.parser")
cards = soup.select(".uc-card_body")

carreras = []
for card in cards:
    a_tag = card.select_one("a.color-black")
    if not a_tag:
        continue
    nombre = a_tag.get_text(strip=True)
    href = a_tag["href"]
    link = href if href.startswith("http") else f"https://admision.uc.cl{href}"
    carreras.append({
        "nombre": nombre,
        "link": link,
        "area": "",     # Puedes completarlo manual o desde facultades si lo deseas
        "subArea": ""
    })

print(f"✅ {len(carreras)} carreras encontradas.")

# ==========================
# 2. Scrapeo de detalles por carrera
# ==========================

detalles = []

for carrera in carreras:
    print(f"🎓 Procesando: {carrera['nombre']}")
    try:
        driver.get(carrera['link'])
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "ul li"))
        )
        time.sleep(1)
        soup = BeautifulSoup(driver.page_source, "html.parser")

        data = {
            "nombre": carrera["nombre"],
            "link": carrera["link"],
            "area": carrera.get("area", ""),
            "subArea": carrera.get("subArea", "")
        }

        # INFO GENERAL
        ul_items = soup.select("ul li.d-flex.mb-20")
        for item in ul_items:
            label = item.find("b")
            if not label:
                continue

            # Eliminar íconos que agregan basura textual
            for icon in item.select("i"):
                icon.decompose()

            label_text = label.get_text(strip=True).lower()
            full_text = item.get_text(separator=" ", strip=True)
            value = full_text.split(":", 1)[-1].strip()

            if "duración" in label_text:
                match = re.search(r"\d+", value)
                if match:
                    data["duracion"] = int(match.group(0))

            elif "arancel anual" in label_text:
                match = re.search(r"[\d\.]+", value)
                if match:
                    data["arancel"] = int(match.group(0).replace(".", ""))

            elif "puntaje promedio mínimo" in label_text:
                match = re.search(r"\d+[\.,]?\d*", value)
                if match:
                    data["puntaje_minimo"] = float(
                        match.group(0).replace(",", "."))

            elif "puntaje último" in label_text:
                match = re.search(r"\d+[\.,]?\d*", value)
                if match:
                    data["puntaje_ultimo"] = float(
                        match.group(0).replace(",", "."))

            elif "vacantes" in label_text:
                match = re.search(r"\d+", value)
                if match:
                    data["vacantes"] = int(match.group(0))

        # PONDERACIONES
        ponderaciones = {}
        reqs = soup.select("section.requirements .requirements__item")
        for r in reqs:
            h = r.select_one("h2")
            p = r.select_one("p")
            if not h or not p:
                continue
            nombre = p.text.strip().lower()
            valor = h.text.strip().replace("%", "")
            try:
                valor = float(valor)
            except:
                continue

            if "nem" in nombre:
                ponderaciones["nem"] = valor
            elif "ranking" in nombre:
                ponderaciones["ranking"] = valor
            elif "lectora" in nombre:
                ponderaciones["compLectora"] = valor
            elif "matemática 1" in nombre:
                ponderaciones["mat1"] = valor
            elif "matemática 2" in nombre:
                ponderaciones["mat2"] = valor
            elif "historia" in nombre:
                ponderaciones["historia"] = valor
            elif "ciencias" in nombre:
                ponderaciones["ciencias"] = valor

        data["ponderaciones"] = ponderaciones
        detalles.append(data)

    except Exception as e:
        print(f"❌ Error en carrera {carrera['nombre']}: {str(e)}")

driver.quit()

# ==========================
# Guardar los datos
# ==========================

with open("carreras_uc_detalle.json", "w", encoding="utf-8") as f:
    json.dump(detalles, f, ensure_ascii=False, indent=2)

print(
    f"📁 Archivo generado: carreras_uc_detalle.json con {len(detalles)} carreras.")
