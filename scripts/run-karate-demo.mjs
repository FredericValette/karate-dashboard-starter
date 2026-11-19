/**
 * Fuehrt die Demo-Karate-Suite aus und konvertiert das Ergebnis direkt
 * ins Dashboard-Format.
 *
 *   npm run karate:demo
 *
 * 1. fuehrt karate-demo/mvnw test aus (Karate-Mock-Server, offline)
 * 2. konvertiert target/karate-reports -> public/karate-reports/demo-run.json
 * 3. registriert die Suite in public/karate-reports/index.json
 * 4. faerbt die Metriken im Terminal
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demoDir = join(root, 'karate-demo');
const mvnw = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

// JAVA_HOME-Korrektur: Originale JAVA_HOME-Env kann ins Leere zeigen.
const findJdk = () => {
  if (process.env.JAVA_HOME && existsSync(process.env.JAVA_HOME)) return process.env.JAVA_HOME;
  const candidates = [
    'C:\\Program Files\\Java\\jdk-21.0.10',
    'C:\\Program Files\\Java\\latest',
    ...(process.env.JAVA_HOME || '').split(/[; ]+/), // zuletzt die (ggf. alte) Env
  ];
  for (const c of candidates) if (c && existsSync(c)) return c;
  return undefined;
};

const env = { ...process.env };
const jdk = findJdk();
if (jdk) {
  env.JAVA_HOME = jdk;
  if (process.env.JAVA_HOME !== env.JAVA_HOME) {
    console.log('> JAVA_HOME durch den Script korrigiert: ' + jdk);
  }
}

console.log('> mvnw test (karate-demo)\n');
const run = spawnSync(mvnw, ['test', '-B'], { cwd: demoDir, stdio: 'inherit', shell: true, env });
if (run.status !== 0 && run.error) {
  console.error('Maven-Wrapper konnte nicht gestartet werden:', run.error.message);
  process.exit(1);
}
// Maven kann bei fehlgeschlagenen Tests nonzero liefern - auch dann wollen wir ergebnisse konvertieren, wenn JSON existiert

console.log('\n> Konvertiere fuer das Dashboard\n');
const conv = spawnSync(
  process.execPath,
  [
    'scripts/karate-to-dashboard.mjs',
    join('karate-demo', 'target', 'karate-reports'),
    '--id', 'demo-run',
    '--label', 'Demo Runner (Mock-API)',
    '--out', join('public', 'karate-reports'),
  ],
  { cwd: root, stdio: 'inherit', shell: true }
);
process.exit(conv.status === 0 ? 0 : 1);
