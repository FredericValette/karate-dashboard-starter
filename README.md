# karate-dashboard-starter

React + Vite Dashboard für Karate-API-Testergebnisse, deployt auf GitHub Pages.

## Entwicklung (lokal)

```bash
npm install
npm run dev          # http://localhost:3000
```

## Testdaten (Reports)

Die Daten liegen in `public/karate-reports/`. Das Register `index.json` bestimmt,
welche Suiten im Dropdown erscheinen:

| Datei | Inhalt |
|-------|--------|
| `index.json` | Liste der Suiten (`id`, `label`, `file`) |
| `test1.json`, `test2.json` | Beispiel-Suiten |
| `demo-run.json` | Ergebnis des Demo-Karate-Runners (Mock-API) |

Auswahl im Dashboard per Dropdown oder URL-Parameter: `?report=test2`

## Demo-Karate-Runner (end-to-end, offline)

```bash
npm run karate:demo
```

1. `karate-demo/mvnw test` — führt Karate 2.1.4 gegen einen eingebetteten MockServer aus
2. konvertiert `karate-demo/target/karate-reports` → `public/karate-reports/demo-run.json`
   und registriert die Suite in `index.json`

Voraussetzung: Java 21. Ein kaputtes `JAVA_HOME` korrigiert das Script automatisch.

## Eigenes Karate-Projekt anbinden

Im Karate-Projekt den Runner mit `outputCucumberJson(true)` betreiben und danach:

```bash
npm run report:generate -- <pfad-zu-target/karate-reports> --id meinProjekt --label "Mein Projekt"
npm run build && git push
```

Die Pipeline `.github/workflows/karate-tests.yml` macht das bei jedem Push
automatisch (id `karate-latest`), sobald JSON-Ergebnisse vorhanden sind.

## Build & Deploy & Verifikation

```bash
npm run build        # produziert dist/
npm run preview      # lokal ansehen, exakt wie auf GitHub Pages
git push             # deployt via GitHub Actions
npm run check:pages  # verifiziert: live == lokal (byte-identisch)
```
