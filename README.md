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