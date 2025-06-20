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

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(service=Service(
    ChromeDriverManager().install()), options=options)

with open("carreras_uc_links.json", "r", encoding="utf-8") as f:
    carreras = json.load(f)

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
            "link": carrera["link"]
        }

        # INFO GENERAL
        ul_items = soup.select("ul li.d-flex.mb-20")
        for item in ul_items:
            label = item.find("b")
            if not label:
                continue
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
            except ValueError:
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

        # SEDE / CAMPUS
        h4 = soup.find(
            "h4", string=lambda t: t and "encuéntranos en" in t.lower() or "encuéntrenos en" in t.lower() or "encuèntranos en" in t.lower())
        ul = h4.find_next("ul")
        li = ul.find("li")
        div = li.find("div")
        campus = div.find("b")
        direccion_tag = div.find("a") or div.find("p")

        if campus and direccion_tag:
            data["sede"] = {
                "campus": campus.get_text(strip=True),
                "direccion": direccion_tag.get_text(strip=True)
            }

        detalles.append(data)

    except ValueError as e:
        print(f"❌ Error en {carrera['nombre']}: {e}")

driver.quit()

with open("carreras_uc_detalle.json", "w", encoding="utf-8") as f:
    json.dump(detalles, f, ensure_ascii=False, indent=2)

print(f"✅ {len(detalles)} carreras procesadas y guardadas en carreras_uc_detalle.json")
