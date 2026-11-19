/**
 * Vergleicht den lokalen dist-Build mit der GitHub-Pages-Live-Seite.
 *
 * Nutzung:
 *   npm run build        # erst frisch bauen
 *   npm run check:pages  # dann lokale dist vs. Live vergleichen
 *
 * Da Vite Assets anhand des Inhalts benennt (Content-Hash im Dateinamen),
 * bedeutet ein identischer Asset-Dateiname => identischer Inhalt.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LIVE_URL = 'https://fredericvalette4atos-lang.github.io/karate-dashboard-starter/';
const PATH = '/karate-dashboard-starter/';
const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

process.stdout.write('Lade Live-Seite: ' + LIVE_URL + ' ... ');
const res = await fetch(LIVE_URL);
if (!res.ok) {
  console.error('FEHLER: HTTP ' + res.status);
  process.exit(1);
}
const liveHtml = await res.text();
console.log('HTTP ' + res.status);

let distHtml;
try {
  distHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
} catch {
  console.error('FEHLER: dist/index.html nicht gefunden - bitte zuerst "npm run build" ausfuehren.');
  process.exit(1);
}

let ok = true;

// 1. index.html vergleichen (Whitespace am Ende + Zeilenenden normalisieren)
const norm = (s) => s.replace(/\r/g, '').trim();
if (norm(distHtml) === norm(liveHtml)) {
  console.log('index.html      : identisch ✓');
} else {
  ok = false;
  console.log('index.html      : UNTERSCHIEDLICH ✗');
  const distAssets = extractAssets(distHtml);
  const liveAssets = extractAssets(liveHtml);
  console.log('  lokal (dist)  : ' + distAssets.join(', '));
  console.log('  live          : ' + liveAssets.join(', '));
}

// 2. JS/CSS-Assets Byte-gegen-Byte vergleichen
const liveAssets = extractAssets(liveHtml);
for (const rel of liveAssets) {
  const localRel = rel.replace(PATH, '');
  const liveRes = await fetch('https://fredericvalette4atos-lang.github.io' + rel);
  let liveAsset, localAsset;
  try {
    liveAsset = Buffer.from(await liveRes.arrayBuffer());
    localAsset = readFileSync(join(DIST, localRel));
  } catch {
    ok = false;
    console.log(rel + ' : lokal NICHT gefunden ✗');
    continue;
  }
  if (liveRes.ok && liveAsset.equals(localAsset)) {
    console.log(rel + ' : byte-identisch ✓');
  } else {
    ok = false;
    console.log(rel + ' : UNTERSCHIEDLICH (live HTTP ' + liveRes.status + ') ✗');
  }
}

// 3. Karate-JSON auf Live erreichbar?
const jsonRes = await fetch('https://fredericvalette4atos-lang.github.io' + PATH + 'karate-reports/test1.json');
console.log('karate-reports/test1.json : HTTP ' + jsonRes.status + (jsonRes.ok ? ' ✓' : ' ✗'));
if (!jsonRes.ok) ok = false;

console.log(ok ? '\nERGEBNIS: Lokal und GitHub Pages sind identisch ✓' : '\nERGEBNIS: UNTERSCHIED - erst "npm run build", committen & pushen, dann erneut pruefen.');
process.exit(ok ? 0 : 1);

function extractAssets(html) {
  return [...html.matchAll(/(?:src|href)="(\/karate-dashboard-starter\/assets\/[^"]+)"/g)]
    .map(m => m[1]);
}
