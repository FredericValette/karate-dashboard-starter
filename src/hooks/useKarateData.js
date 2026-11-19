import { useEffect, useState } from 'react';
import axios from 'axios';

// Basis-Pfad: '/' lokal im Dev-Server, '/karate-dashboard-starter/' auf GitHub Pages
const BASE = import.meta.env.BASE_URL;

// Datei-Register: listet alle verfügbaren Reports.
// Neue Report hinzufuegen = JSON nach public/karate-reports/ legen
// und in index.json einen Eintrag ergaenzen.
const FALLBACK_INDEX = [{ id: 'test1', label: 'Test Suite 1', file: 'test1.json' }];

/** Fallback, falls index.json fehlt/unparsbar ist */
function deriveIndexFrom(data, id) {
  return [{ id, label: id, file: id + '.json' }];
}

/**
 * Liest den Report-Parameter aus der URL (?report=test1).
 */
export function readReportFromUrl() {
  return new URLSearchParams(window.location.search).get('report');
}

/**
 * Zentrales Daten-Hook des Dashboards.
 *
 * - laedt das Register aller Reports (karate-reports/index.json)
 * - laedt den ausgewaehlten Report (karate-reports/<file>) alle 30 Sekunden
 * - laedt ALLE Reports fuer den Verlaufs-Chart
 * - ausgewaehlter Report via Dropdown ODER URL-Parameter (?report=test1)
 *   -> der Parameter wird beim Wechsel in die URL geschrieben (teilbare Links)
 *
 * Report-JSON-Eintraege: { scenarioName, status, duration, timestamp, steps[], error }
 */
export default function useKarateData() {
  const [reportDefs, setReportDefs] = useState([]); // Register aus index.json
  const [reportId, setReportIdState] = useState(readReportFromUrl()); // null = "erster aus Register"
  const [data, setData] = useState([]); // Szenarien des gewaehlten Reports
  const [allReports, setAllReports] = useState({}); // { [id]: { def, data } } fuer Chart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auswahl setzen + URL-Parameter pflegen (teilungsfreundliche Links)
  const setReportId = (id) => {
    setReportIdState(id);
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set('report', id);
    } else {
      url.searchParams.delete('report');
    }
    window.history.replaceState(null, '', url);
  };

  // Register laden (einmalig)
  useEffect(() => {
    axios
      .get(BASE + 'karate-reports/index.json', {
        headers: { Accept: 'application/json' },
      })
      .then((res) => {
        const defs = Array.isArray(res.data) && res.data.length > 0 ? res.data : FALLBACK_INDEX;
        setReportDefs(defs);
        // Wenn kein (oder ein unbekannter) URL-Parameter: ersten Report aus Register waehlen
        const current = readReportFromUrl();
        if (!current || !defs.some((d) => d.id === current)) {
          setReportIdState(defs[0].id);
        }
      })
      .catch((err) => {
        console.error('index.json konnte nicht geladen werden, nutze Fallback', err);
        setReportDefs(FALLBACK_INDEX);
        const current = readReportFromUrl();
        if (!current) setReportIdState(FALLBACK_INDEX[0].id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gewaehlten Report laden (auch alle 30 Sekunden neu)
  useEffect(() => {
    if (!reportId) return undefined;
    const load = async () => {
      try {
        setLoading(true);
        const def = reportDefs.find((d) => d.id === reportId);
        const file = (def && def.file) || reportId + '.json';
        const res = await axios.get(BASE + 'karate-reports/' + file, {
          headers: { Accept: 'application/json' },
        });
        setData(Array.isArray(res.data) ? res.data : deriveIndexFrom(res.data, reportId));
        setError(null);
      } catch (err) {
        setError('Report "' + reportId + '" konnte nicht geladen werden');
        setData([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [reportId, reportDefs]);

  // ALLE Reports fuer den Verlaufs-Chart laden (einmalig + alle 30 Sekunden)
  useEffect(() => {
    if (reportDefs.length === 0) return undefined;
    const loadAll = async () => {
      const results = await Promise.allSettled(
        reportDefs.map((def) => axios.get(BASE + 'karate-reports/' + def.file))
      );
      const map = {};
      reportDefs.forEach((def, i) => {
        if (results[i].status === 'fulfilled' && Array.isArray(results[i].value.data)) {
          map[def.id] = { def, data: results[i].value.data };
        }
      });
      setAllReports(map);
    };
    loadAll();
    const interval = setInterval(loadAll, 30000);
    return () => clearInterval(interval);
  }, [reportDefs]);

  /** Kennzahlen fuer den gewaehlten Report */
  const summary = {
    total: data.length,
    passed: data.filter((t) => t.status === 'PASSED').length,
    failed: data.filter((t) => t.status !== 'PASSED').length,
    get passedPct() {
      return this.total ? Math.round((this.passed / this.total) * 100) : 0;
    },
    get failedPct() {
      return this.total ? 100 - this.passedPct : 0;
    },
    get durationSeconds() {
      return data.reduce((sum, t) => sum + (Number(t.duration) || 0), 0) / 1000;
    },
  };

  /** Daten fuer den Verlaufs-Chart: eine Zeile pro Report */
  const chartData = reportDefs
    .filter((def) => allReports[def.id])
    .map((def) => {
      const rows = allReports[def.id].data;
      const passed = rows.filter((t) => t.status === 'PASSED').length;
      const failed = rows.length - passed;
      const duration = rows.reduce((s, t) => s + (Number(t.duration) || 0), 0) / 1000;
      return { name: def.label || def.id, passed, failed, duration: Number(duration.toFixed(1)) };
    });

  return {
    reports: reportDefs,
    reportId,
    setReportId,
    data,
    loading,
    error,
    summary,
    chartData,
  };
}
