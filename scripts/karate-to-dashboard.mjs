/**
 * Konverter: Karate-Ergebnis-JSON -> Dashboard-Format
 *
 * Wandelt das JSON, das Karate beim Lauf erzeugt (Cucumber-JSON je Feature,
 * z. B. target/karate-reports/<feature>.json), in das Array-Format des
 * Dashboards ([{ scenarioName, status, duration, timestamp, steps, error }])
 * um und traegt die Datei automatisch in public/karate-reports/index.json ein.
 *
 * Unterstuetzte Eingabeformen:
 *   1. Cucumber-JSON (Beschreibung. Array von Features mit "elements"),
 *      wie es Karate mit outputCucumberJson(true) erzeugt
 *   2. Dashboard-Format (Array mit scenarioName/status) -> 1:1 Durchlauf
 *
 * Nutzung:
 *   node scripts/karate-to-dashboard.mjs target/karate-reports \
 *        --out public/karate-reports --id test3 --label "Meine Suite"
 *
 *   - Eingaben koennen Dateien oder Verzeichnisse sein (Verzeichnisse werden
 *     nach *.json rekursiv durchsucht)
 *   - Cucumber-Dauern sind Nanosekunden -> in Millisekunden konvertiert
 *   - id/label steuern Dropdown-Eintrag und Dateinamen (<id>.json)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const argv = process.argv.slice(2);
const flags = { out: 'public/karate-reports' };
const inputs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--out') flags.out = argv[++i];
  else if (argv[i] === '--id') flags.id = argv[++i];
  else if (argv[i] === '--label') flags.label = argv[++i];
  else inputs.push(argv[i]);
}
if (inputs.length === 0 || !flags.id) {
  console.error('Nutzung: node scripts/karate-to-dashboard.mjs <datei|ordner...> --id test3 [--label "Titel"] [--out public/karate-reports]');
  process.exit(1);
}

// ---------- JSON-Dateien einsammeln ----------
function collectJsonFiles(path, acc = []) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (entry === 'karate-summary.json') continue; // nur Feature-Ergebnisse
      collectJsonFiles(join(path, entry), acc);
    }
  } else if (path.endsWith('.json')) {
    acc.push(path);
  }
  return acc;
}

// ---------- Karate-JSON-Formen -> Dashboard-Zeilen ----------
function cucumberToRows(cucumberJson) {
  const features = Array.isArray(cucumberJson) ? cucumberJson : [cucumberJson];
  const rows = [];
  for (const feature of features) {
    const elements = Array.isArray(feature.elements) ? feature.elements : [];
    for (const scenario of elements) {
      // Result: letzten Schritt-Result (der Szenario-Status)
      const steps = scenario.steps || [];
      const failedStep = steps.find((s) => s.result && s.result.status !== 'passed' && s.result.status !== 'skipped');
      const result = failedStep ? failedStep.result : steps[steps.length - 1]?.result;
      const status = (result && result.status ? result.status : 'passed').toUpperCase();
      // Cucumber/Karate-Dauer: Nanosekunden -> Millisekunden (Summe aller Steps)
      const durationNs = steps.reduce((sum, s) => sum + Number((s.result && s.result.duration) || 0), 0);
      const row = {
        scenarioName: scenario.name || scenario.keyword || '(unbenanntes Szenario)',
        status,
        duration: Math.round(durationNs / 1e6),
        timestamp: new Date().toISOString(),
      };
      row.steps = steps.map((s) => ({
        name: s.name ? s.keyword.trim() + ' ' + s.name : s.keyword.trim(),
        status: (s.result && s.result.status ? s.result.status : 'skipped').toUpperCase(),
      }));
      if (status !== 'PASSED' && result && (result.error_message || result.errorMessage)) {
        row.error = { message: result.error_message || result.errorMessage };
      }
      rows.push(row);
    }
  }
  return rows;
}

function toDashboardRows(json) {
  // Form A: bereits Dashboard-Format
  if (Array.isArray(json) && json.length > 0 && json.every((r) => !r.elements)) return json;
  // Form B: Cucumber-JSON
  return cucumberToRows(json);
}

// ---------- Konvertieren ----------
const rows = [];
for (const input of inputs) {
  for (const file of collectJsonFiles(resolve(input))) {
    try {
      const json = JSON.parse(readFileSync(file, 'utf8'));
      rows.push(...toDashboardRows(json));
      console.log('ok : ' + file);
    } catch (err) {
      console.warn('skip (ungueltiges JSON): ' + file + ' - ' + err.message);
    }
  }
}
if (rows.length === 0) {
  console.error('FEHLER: keine Szenarien gefunden - sind das Karate-Ergebnis-JSONs?');
  process.exit(1);
}

mkdirSync(flags.out, { recursive: true });
writeFileSync(join(flags.out, flags.id + '.json'), JSON.stringify(rows, null, 2));
console.log('> ' + flags.out + '/' + flags.id + '.json (' + rows.length + ' Szenarien)');

// ---------- index.json aktualisieren ----------
const indexPath = join(flags.out, 'index.json');
let index = [];
try {
  index = JSON.parse(readFileSync(indexPath, 'utf8'));
  if (!Array.isArray(index)) index = [];
} catch {
  index = [];
}
const entry = { id: flags.id, label: flags.label || flags.id, file: flags.id + '.json' };
const existing = index.findIndex((e) => e.id === flags.id);
existing >= 0 ? (index[existing] = entry) : index.push(entry);
writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log('> ' + indexPath + ' aktualisiert (' + index.length + ' Reports)');
