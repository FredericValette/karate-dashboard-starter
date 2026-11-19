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
---

#✅ **Alles grün und live** — die Pipeline (`df206d6`) läuft jetzt inkl. echtem Karate-Lauf in CI, `demo-run` ist im Dropdown (`index.json live: [test1, test2, demo-run]`) und `demo-run.json` liefert HTTP 200 auf GitHub Pages.

## Was du jetzt hast

### 1. Demo-Runner (end-to-end, komplett offline)

```bash
npm run karate:demo
```

Kette: `karate-demo/mvnw test` (Karate 2.1.4, eingebetteter MockServer — **kein externes System nötig**) → 4 Szenarien grün → Cucumber-JSON → Konverter → `public/karate-reports/demo-run.json` + `index.json` → Browser-Refresh, neue Suite **„Demo Runner (Mock-API)"** im Dropdown.

Unterwegs haben wir drei echte Stolpersteine abgeräumt (alle im Code dokumentiert):
- **diese JAVA_HOME-Umgebung ist kaputt** (zeigt auf nicht existierendes `.jdk/jdk-25`) → das Script korrigiert das automatisch auf `C:\Program Files\Java\jdk-21.0.10`
- **Karate 2 bringt kein java.* mehr mit in der JS-Engine** (`java.util.UUID` → `ReferenceError`) → Mock mit reinen JS-IDs
- **Karate 2 `Runner.path` löst bei Windows das `classpath:`-Präfix falsch auf** → relativer Dateisystem-Pfad

### 2. Anbindung deines Karate-Projekts (`/d/TTT/karate/karate-todo`)

Zwei Wege:

**A) Schnell (einmalig aus vorhandenem Output):** Falls dort schon `target/karate-reports` existiert oder du es einmal startest:

```bash
cd /d/TTT/karate-dashboard-starter
npm run report:generate -- /d/TTT/karate/karate-todo/target/karate-reports/cucumber-json \
  --id karate-todo --label "Todo-App API-Tests"
npm run build && git push
```

**B) Dauerhaft:** im Runner von karate-todo die JSON-Ausgabe einschalten (Karate-2-API, exakt wie im Demo-Runner):

```java
SuiteResult result = Runner
    .path("src/test/java/app/api")          // FS-Pfad, kein "classpath:" (Windows!)
    .global("serverUrl", serverUrl)          // "global", nicht systemProperty
    .outputCucumberJson(true)
    .parallel(1);
```

### 3. Pipeline (läuft bereits so, `df206d6` grün)

Je Push in CI: Karate-Demo-Suite (Ubuntu-Runner haben vorinstalliertes `mvn`) → Convert → Build → Deploy. Für **dein echtes Projekt** ist im Workflow ein Kommentar-Step vorbereitet — sobald du sein Repo als Zweig/Submodule einbindest oder die Tests in CES ausführst, erscheint die Suite **„Letzter Karate-Lauf"** automatisch online.

> Hard-Refresh (`Strg+Shift+R`) auf der Live-Seite → drei Nachrichten im Dropdown, inkl. dem aus echtem Karate-Lauf erzeugten `demo-run` (Zeitstempel = der CI-Lauf von heute).
