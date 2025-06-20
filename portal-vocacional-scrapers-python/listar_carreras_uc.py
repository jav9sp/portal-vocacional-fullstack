# listar_carreras.py

import json
import time
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

print("🔄 Cargando listado de carreras UC...")
driver.get("https://admision.uc.cl/carreras/")
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, ".uc-card_body")))
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
        "link": link
    })

driver.quit()

with open("carreras_uc_links.json", "w", encoding="utf-8") as f:
    json.dump(carreras, f, ensure_ascii=False, indent=2)

print(f"✅ {len(carreras)} carreras guardadas en carreras_uc_links.json")
