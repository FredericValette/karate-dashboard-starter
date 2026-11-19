[![Karate Tests + Deploy Dashboard](https://github.com/fredericvalette4atos-lang/karate-dashboard-starter/actions/workflows/karate-tests.yml/badge.svg)](https://github.com/fredericvalette4atos-lang/karate-dashboard-starter/actions/workflows/karate-tests.yml)
# karate-dashboard-starter
karate-dashboard-starter

Start mit 
```
npm run dev
```
Dann im Browser : http://localhost:3001/


✅ Erledigt — und die gute Nachricht vorab: **Deine lokale `dist` und die GitHub-Pages-Live-Seite sind bereits identisch** (der Router-Basename-Fix `60b6ef6` ist also live angekommen — lade die Seite mit `Strg + Shift + R`, dann solltest du das Dashboard sehen!).

## Deine Mittel für den Lokal-↔-Pages-Abgleich

### 1. Vorschau wie auf GitHub Pages

```bash
npm run build     # dist frisch bauen
npm run preview   # → http://localhost:4173/karate-dashboard-starter/
```

`vite preview` stellt den `dist`-Build **exakt so** bereit wie GitHub Pages — gleicher Unterpfad, gleiche Assets. Was du dort siehst, ist genau das, was Pages ausliefert.

### 2. Automatischer Inhalt-Abgleich (neu: `scripts/check-pages.mjs`)

```bash
npm run check:pages
```

Vergleicht die Live-Seite Byte-für-Byte mit deinem lokalen `dist`:

```
Lade Live-Seite: ... HTTP 200
index.html      : identisch ✓
/assets/index-zrfyuXue.js  : byte-identisch ✓
/assets/index-DgEcOtco.css : byte-identisch ✓
karate-reports/test1.json : HTTP 200 ✓

ERGEBNIS: Lokal und GitHub Pages sind identisch ✓
```

Das Script prüft:
- `index.html` (Zeilenende-unabhängig — lokal war ein paarigCR verrutscht)
- **Alle JS/CSS-Assets per Byte-Vergleich** — dank Vite-Content-Hashes im Dateinamen ist das ein eindeutiger Beweis für identischen Code
- Erreichbarkeit der Karate-JSON-Daten auf Live

Exit-Code ist 0 nur bei vollständiger Übereinstimmung → kannst du auch in Scripts/CI einbauen.

### Empfohlener Workflow

```bash
npm run build        # kompilieren
npm run preview      # lokal anschauen (wie auf Pages)
git add -A && git commit && git push   # deployen (~1–2 Min Workflow)
npm run check:pages  # verifizieren: live == lokal
```

# Daten
✅ Fertig und live verifiziert: Workflow grün (~14:50), `npm run check:pages` bestätigt — **Lokal (dist) und GitHub Pages sind identisch**, inklusive der neuen Daten.

## Was jetzt parametrisiert ist

### Neue Architektur

```
public/karate-reports/
├── index.json      ← Register: welche Reports gibt es?
├── test1.json      ← Test Suite 1
└── test2.json      ← Test Suite 2 (neu, mit FAILs zum Testen)

src/hooks/
└── useKarateData.js  ← zentrales Daten-Hook: laden, Polling (30 s), Kennzahlen

src/components/
├── Dashboard.jsx         ← Dropdown im Header, Metriken & Chart aus echten Daten
└── TestResultsTable.jsx  ← bekommt Daten als Props, WebSocket-Live-Zeilen separat
```

### Bedienung

- **Dropdown im Dashboard-Header** (`📁 Report: Test Suite 1 / Test Suite 2`) — Umschalten lädt sofort den anderen Report
- **URL-Parameter** — teilbare Links:
  ```
  https://fredericvalette4atos-lang.github.io/karate-dashboard-starter/?report=test2
  ```
  Auch lokal: `http://localhost:3000/?report=test2`. Beim Umschalten wird der Parameter automatisch in die URL geschrieben.
- Askiv zeigt die Metriken jetzt **echte Werte** statt der hart codierten 95 %/42: Passed %, Failed %, Gesamtdauer, Testanzahl — für den gewählten Report. Der Chart zeigt Passed/Failed/Dauer **pro Report** (Verlauf über alle Suites).

### So fügst du neue Daten hinzu (ohne Code-Änderung)

1. Neue JSON-Datei ins Verzeichnis `public/karate-reports/` legen (Format: Array wie in `test1.json`):
   ```json
   [
     { "scenarioName": "...", "status": "PASSED", "duration": 800, "timestamp": "..." }
   ]
   ```
2. Eintrag in `public/karate-reports/index.json` ergänzen:
   ```json
   { "id": "test3", "label": "Smoke Suite", "file": "test3.json" }
   ```
3. `npm run build`, committen, pushen → erscheint automatisch im Dropdown, im Chart und via `?report=test3`.
   (Falls `index.json` mal fehlt: Das Dashboard fällt automatisch auf `test1.json` zurück.)

### Später mit echten Karate-Runs

Die Pipeline (Schritt „Copy Karate Reports") kopiert mit `mvn` generierte JSONs einfach in `public/karate-reports/` — sobald deren Registrierung aktualisiert wird, erscheint der echte Lauf im Dropdown. Wenn du willst, erweitere ich `check-pages.mjs` als Nächstes um ein kleines Node-Skript, das **automatisch index.json aus den vorhandenen JSON-Dateien generiert** (Scan des Ordners statt manuelles Pflegen) — sage einfach Bescheid.

Lade die Live-Seite mit `Strg + Shift + R` und probiere das Dropdown + `?report=test2` aus. 🎯