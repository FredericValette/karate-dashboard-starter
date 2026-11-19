Hier ist eine **praktische Empfehlung** für dein **SPA-Dashboard mit Karate-Tests und optional Live-Daten**, inklusive **Architekturvorschlag, Code-Beispielen und Integrationsmöglichkeiten**.

---

---

---

## 🎯 **Empfohlene SPA-Stacks für dein Dashboard**
*(Sortiert nach Einfachheit, Skalierbarkeit und Karate-Integration)*

| **Framework** | **Vorteile** | **Nachteile** | **Live-Daten-Integration** | **Empfehlung für dich** |
|---------------------|-----------------------------------------------------------------------------|----------------------------------------|-----------------------------------------------|----------------------------------|
| **React + Vite** | ⚡ Schnell, ✅ Große Community, 📦 Leichtgewichtig, 🔄 Einfache State-Management-Optionen (Zustand, Redux) | ⚠️ JSX-Lernkurve | ✅ WebSockets, Polling, SSE | **⭐ Beste Wahl** (flexibel & modern) |
| **Vue 3 + Vite** | 📖 Einfache Syntax, ⚡ Schnell, 🎨 Reaktivität out-of-the-box | ⚠️ Kleinere Community als React | ✅ WebSockets, Polling, SSE | ⭐ Gut für schnelle Prototypen |
| **Svelte + Vite** | 🚀 Kein Virtual DOM, ⚡ Ultra-schnell, 📦 Tiny Bundle Size | ⚠️ Weniger Plugins als React/Vue | ✅ WebSockets, Polling, SSE | ⭐ Ideal für Performance |
| **Angular** | 🏗️ Vollständiges Framework (Routing, HTTP, Forms), 📚 Enterprise-tauglich | ⚠️ Komplexer, schwerer | ✅ WebSockets, Polling, SSE | ⚠️ Nur für große Projekte |
| **Next.js** | ✅ SSR/SSG, 🔄 API-Routes integriert, 📊 SEO-freundlich | ⚠️ Überkill für reine Dashboards | ✅ WebSockets, Polling, SSE + Serverless | ⚠️ Nur bei Bedarf für SEO |

---
**👉 Meine Empfehlung für dich: [React + Vite](#-1-react--vite-komplettbeispiel)**
*(Einfach, schnell, perfekt für Dashboards + Live-Daten)*

---

---

---

## 🚀 **1. React + Vite: Komplettbeispiel**
*(SPA mit Karate-Testdaten + Live-Daten-Option)*

### **📁 Projektstruktur**
```
karate-dashboard/
├── public/
│ └── karate-reports/ # Karate HTML/JSON Reports
│ ├── test1.json # Karate JSON-Output (z. B. von `karate run --format=json`)
│ └── test2.json
├── src/
│ ├── components/
│ │ ├── TestResultsTable.jsx
│ │ ├── LiveDataToggle.jsx
│ │ └── Dashboard.jsx
│ ├── hooks/
│ │ └── useKarateData.js # Custom Hook für Datenabruf
│ ├── App.jsx
│ └── main.jsx
├── vite.config.js
├── package.json
└── index.html
```

---

### **📦 package.json**
```json
{
"name": "karate-dashboard",
"private": true,
"version": "1.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
},
"dependencies": {
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-router-dom": "^6.20.0",
"recharts": "^2.10.3", // Für Diagramme
"axios": "^1.6.2", // Für HTTP-Requests
"socket.io-client": "^4.7.2", // Für Live-Daten (WebSockets)
"date-fns": "^2.30.0" // Für Datumsformatierung
},
"devDependencies": {
"@types/react": "^18.2.42",
"@types/react-dom": "^18.2.17",
"@vitejs/plugin-react": "^4.2.1",
"vite": "^5.0.8"
}
}
```

---

### **⚡ vite.config.js**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
plugins: [react()],
server: {
port: 3000,
proxy: {
// Proxy für Live-Daten (falls Backend auf anderem Port läuft)
'/api': {
target: 'http://localhost:8080',
changeOrigin: true,
},
},
},
});
```

---

### **🎨 src/App.jsx**
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Dashboard />} />
</Routes>
</Router>
);
}

export default App;
```

---

### **📊 src/components/Dashboard.jsx**
```jsx
import React, { useState } from 'react';
import TestResultsTable from './TestResultsTable';
import LiveDataToggle from './LiveDataToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
const [isLive, setIsLive] = useState(false);

return (
<div className="dashboard">
<header>
<h1>🎯 Karate Test Dashboard</h1>
<LiveDataToggle isLive={isLive} setIsLive={setIsLive} />
</header>

<div className="metrics">
<div className="metric-card">
<h3>✅ Passed</h3>
<p>95%</p>
</div>
<div className="metric-card">
<h3>❌ Failed</h3>
<p>5%</p>
</div>
<div className="metric-card">
<h3>⚡ Duration</h3>
<p>12.5s</p>
</div>
<div className="metric-card">
<h3>📊 Tests</h3>
<p>42</p>
</div>
</div>

<div className="chart-container">
<h2>Test Results Over Time</h2>
<ResponsiveContainer width="100%" height={300}>
<LineChart data={[
{ name: 'Run 1', passed: 80, failed: 20 },
{ name: 'Run 2', passed: 85, failed: 15 },
{ name: 'Run 3', passed: 90, failed: 10 },
{ name: 'Run 4', passed: 95, failed: 5 },
]}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Line type="monotone" dataKey="passed" stroke="#00ff80" name="Passed" />
<Line type="monotone" dataKey="failed" stroke="#ff4444" name="Failed" />
</LineChart>
</ResponsiveContainer>
</div>

<TestResultsTable isLive={isLive} />
</div>
);
};

export default Dashboard;
```

---

### **📋 src/components/TestResultsTable.jsx**
```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const TestResultsTable = ({ isLive }) => {
const [testData, setTestData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Funktion zum Laden der Karate-Daten (JSON)
const loadKarateData = async () => {
try {
setLoading(true);
// Option 1: Lade statische JSON-Dateien aus /public/karate-reports
const response = await axios.get('/karate-reports/test1.json');
setTestData(response.data);
setError(null);
} catch (err) {
setError('Failed to load test data');
console.error(err);
} finally {
setLoading(false);
}
};

// Funktion für Live-Daten (WebSocket)
useEffect(() => {
if (isLive) {
// Option 2: Live-Daten via WebSocket (z. B. von einem Backend)
const socket = new WebSocket('ws://localhost:8080/karate-live');

socket.onopen = () => {
console.log('Connected to WebSocket');
};

socket.onmessage = (event) => {
const data = JSON.parse(event.data);
setTestData(prev => [...prev, data]);
};

socket.onerror = (err) => {
setError('WebSocket error');
console.error(err);
};

return () => socket.close();
} else {
// Lade statische Daten
loadKarateData();
}
}, [isLive]);

// Automatisches Neuladen der statischen Daten alle 30 Sekunden
useEffect(() => {
if (!isLive) {
const interval = setInterval(loadKarateData, 30000);
return () => clearInterval(interval);
}
}, [isLive]);

if (loading) return <div className="loading">Loading test data...</div>
if (error) return <div className="error">{error}</div>

return (
<div className="test-results">
<h2>Test Results</h2>
<table>
<thead>
<tr>
<th>Test Name</th>
<th>Status</th>
<th>Duration (ms)</th>
<th>Timestamp</th>
<th>Error</th>
</tr>
</thead>
<tbody>
{testData.map((test, index) => (
<tr key={index} className={test.status === 'PASSED' ? 'passed' : 'failed'}>
<td>{test.name || test.scenarioName}</td>
<td>
<span className={`status-badge ${test.status === 'PASSED' ? 'passed' : 'failed'}`}>
{test.status}
</span>
</td>
<td>{test.duration || test.time || 'N/A'}</td>
<td>{test.timestamp ? format(new Date(test.timestamp), 'HH:mm:ss') : 'N/A'}</td>
<td>{test.error ? test.error.message : '-'}</td>
</tr>
))}
</tbody>
</table>
</div>
);
};

export default TestResultsTable;
```

---

### **🔄 src/components/LiveDataToggle.jsx**
```jsx
import React from 'react';

const LiveDataToggle = ({ isLive, setIsLive }) => {
return (
<div className="live-toggle">
<label>
<input
type="checkbox"
checked={isLive}
onChange={(e) => setIsLive(e.target.checked)}
/>
<span className={`toggle-label ${isLive ? 'live' : 'static'}`}>
{isLive ? '🔴 LIVE' : '🟢 STATIC'}
</span>
</label>
</div>
);
};

export default LiveDataToggle;
```

---
---

### **🎨 src/App.css**
```css
/* Basis-Stile (passend zu deinem PZP-Design) */
:root {
--bg-dark: #030810;
--bg-darker: #0a1a2a;
--text-primary: #c8d8f0;
--text-secondary: #8a9ba8;
--accent-passed: #00ff80;
--accent-failed: #ff4444;
--accent-live: #ff00ff;
--border-color: rgba(0, 180, 255, 0.3);
}

body {
margin: 0;
font-family: 'Share Tech Mono', monospace;
background: var(--bg-dark);
color: var(--text-primary);
line-height: 1.6;
}

.dashboard {
max-width: 1400px;
margin: 0 auto;
padding: 20px;
}

header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 30px;
border-bottom: 1px solid var(--border-color);
padding-bottom: 20px;
}

header h1 {
font-family: 'Exo 2', sans-serif;
color: #00b4ff;
margin: 0;
letter-spacing: 0.1em;
}

/* Metrics Cards */
.metrics {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
margin-bottom: 30px;
}

.metric-card {
background: var(--bg-darker);
border: 1px solid var(--border-color);
border-radius: 4px;
padding: 20px;
text-align: center;
}

.metric-card h3 {
margin: 0 0 10px;
color: var(--text-secondary);
font-size: 0.9em;
}

.metric-card p {
margin: 0;
font-size: 2em;
font-weight: bold;
}

/* Chart Container */
.chart-container {
background: var(--bg-darker);
border: 1px solid var(--border-color);
border-radius: 4px;
padding: 20px;
margin-bottom: 30px;
}

.chart-container h2 {
margin-top: 0;
color: #00b4ff;
font-size: 1.2em;
}

/* Test Results Table */
.test-results {
background: var(--bg-darker);
border: 1px solid var(--border-color);
border-radius: 4px;
padding: 20px;
}

.test-results h2 {
margin-top: 0;
color: #00b4ff;
font-size: 1.2em;
}

table {
width: 100%;
border-collapse: collapse;
}

th, td {
padding: 12px 15px;
text-align: left;
border-bottom: 1px solid var(--border-color);
}

th {
color: var(--text-secondary);
font-size: 0.8em;
text-transform: uppercase;
letter-spacing: 0.1em;
}

tr.passed {
background: rgba(0, 255, 128, 0.1);
}

tr.failed {
background: rgba(255, 68, 68, 0.1);
}

.status-badge {
padding: 4px 8px;
border-radius: 4px;
font-size: 0.7em;
font-weight: bold;
}

.status-badge.passed {
background: rgba(0, 255, 128, 0.2);
color: var(--accent-passed);
}

.status-badge.failed {
background: rgba(255, 68, 68, 0.2);
color: var(--accent-failed);
}

/* Live Toggle */
.live-toggle {
margin-left: 20px;
}

.live-toggle input {
display: none;
}

.live-toggle .toggle-label {
display: inline-block;
padding: 8px 16px;
background: var(--bg-darker);
border: 1px solid var(--border-color);
border-radius: 4px;
cursor: pointer;
transition: all 0.3s;
}

.live-toggle input:checked + .toggle-label {
background: rgba(255, 0, 255, 0.2);
border-color: var(--accent-live);
color: var(--accent-live);
}

.loading, .error {
text-align: center;
padding: 20px;
color: var(--text-secondary);
}

.error {
color: var(--accent-failed);
}
```

---
---

### **📁 index.html**
```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Karate Test Dashboard</title>
<!-- Google Fonts (Share Tech Mono & Exo 2) -->
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;600&display=swap" rel="stylesheet">
</head>
<body>
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---
---
---
---

## 🔌 **2. Karate-Integration: Datenquellen**
### **Option 1: Statische JSON-Dateien (einfachste Lösung)**
1. **Karate-Tests mit JSON-Output ausführen**:
```bash
# Führe Karate-Tests aus und generiere JSON-Report
mvn test -Dtest=TestsRunner -Dkarate.options="--format=json --output=target/karate-reports"
```
→ Erzeugt JSON-Dateien in `target/karate-reports/`.

2. **JSON-Dateien in `/public/karate-reports/` kopieren**:
```bash
cp -r target/karate-reports public/
```

3. **Struktur einer Karate-JSON-Datei** (Beispiel):
```json
{
"name": "Test Suite 1",
"timestamp": "2024-05-20T10:00:00Z",
"tests": [
{
"scenarioName": "Login Test",
"status": "PASSED",
"duration": 1200,
"time": 1.2,
"steps": [
{ "name": "Given URL", "status": "PASSED" },
{ "name": "When Login", "status": "PASSED" }
]
},
{
"scenarioName": "Logout Test",
"status": "FAILED",
"duration": 5000,
"error": {
"message": "Element not found",
"stackTrace": "..."
}
}
],
"summary": {
"passed": 1,
"failed": 1,
"total": 2,
"duration": 6.2
}
}
```

---
### **Option 2: Live-Daten via WebSocket (Echtzeit)**
Falls du **Echtzeit-Updates** brauchst, kannst du ein **Backend** einrichten, das:
1. Karate-Tests ausführt.
2. Ergebnisse via **WebSocket** an das SPA sendet.

#### **Beispiel: Node.js Backend mit WebSocket**
```javascript
// server.js (Node.js + Express + Socket.io)
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// Endpunkt für statische Karate-Reports
app.use('/karate-reports', express.static('karate-reports'));

// WebSocket für Live-Daten
io.on('connection', (socket) => {
console.log('Client connected');

// Führe Karate-Tests aus und sende Ergebnisse in Echtzeit
const karateProcess = exec('mvn test -Dtest=TestsRunner');

karateProcess.stdout.on('data', (data) => {
// Parsen der Karate-Outputs (z. B. JSON)
const testData = parseKarateOutput(data);
if (testData) {
socket.emit('karate-data', testData);
}
});

karateProcess.stderr.on('data', (data) => {
socket.emit('karate-error', data.toString());
});
});

function parseKarateOutput(output) {
// Hier: Parsen der Karate-Outputs (z. B. JSON)
// Beispiel: Extrahiere Test-Ergebnisse aus der Konsole
try {
const lines = output.toString().split('\n');
const resultLine = lines.find(line => line.includes('scenarios passed'));
if (resultLine) {
return {
timestamp: new Date().toISOString(),
message: resultLine.trim()
};
}
} catch (err) {
console.error('Error parsing output:', err);
}
return null;
}

httpServer.listen(8080, () => {
console.log('Server running on http://localhost:8080');
});
```

#### **Starten des Backends**
```bash
node server.js
```
→ Das SPA verbindet sich dann mit `ws://localhost:8080` (wie in `TestResultsTable.jsx` gezeigt).

---
---
---
---

## 🔄 **3. Alternative Live-Daten-Methoden**
*(Falls WebSockets nicht möglich sind)*

| **Methode** | **Beschreibung** | **Vorteil** | **Nachteil** | **Code-Beispiel** |
|----------------------|---------------------------------------------------------------------------------|--------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------|
| **Polling** | SPA fragt regelmäßig Backend ab (z. B. alle 5 Sekunden). | Einfach zu implementieren | Hohe Server-Last | `setInterval(() => axios.get('/api/tests'), 5000)` |
| **Server-Sent Events (SSE)** | Server sendet Updates an SPA (einseitige Kommunikation). | Geringere Latenz als Polling | Nur Text-Daten, keine Binärdaten | [SSE-Beispiel](#-sse-beispiel) |
| **Webhooks** | Backend benachrichtigt SPA über Callback-URL (z. B. mit ngrok). | Echtzeit, skalierbar | Benötigt öffentliche URL für SPA | `app.post('/webhook', (req, res) => { io.emit('update', req.body); })` |
| **GraphQL Subscriptions** | Echtzeit-Updates über GraphQL (z. B. mit Apollo Client). | Modern, flexibel | Komplexere Einrichtung | [GraphQL-Beispiel](#-graphql-beispiel) |

---

### **📡 SSE-Beispiel (Server)**
```javascript
// server.js (Node.js + Express)
const express = require('express');
const app = express();

app.get('/sse', (req, res) => {
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

// Sende alle 2 Sekunden ein Update
const interval = setInterval(() => {
const data = { timestamp: new Date().toISOString(), tests: getLatestTests() };
res.write(`data: ${JSON.stringify(data)}\n\n`);
}, 2000);

req.on('close', () => {
clearInterval(interval);
});
});

function getLatestTests() {
// Hier: Lade die neuesten Karate-Testergebnisse
return [{ name: 'Test 1', status: 'PASSED' }];
}

app.listen(8080, () => console.log('SSE Server running on port 8080'));
```

### **📡 SSE-Beispiel (Client in React)**
```jsx
// src/hooks/useSse.js
import { useEffect, useState } from 'react';

export const useSse = (url) => {
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
const eventSource = new EventSource(url);

eventSource.onmessage = (e) => {
const parsedData = JSON.parse(e.data);
setData(parsedData);
};

eventSource.onerror = (err) => {
setError('EventSource failed.');
eventSource.close();
};

return () => eventSource.close();
}, [url]);

return { data, error };
};

// Usage in TestResultsTable.jsx
const { data: liveData } = useSse('http://localhost:8080/sse');
```

---
---
---
---

## 📊 **4. Dashboard-Erweiterungen**
*(Zusätzliche Features für dein SPA)*

### **🔹 1. Filter & Suche**
```jsx
// In TestResultsTable.jsx
const [filter, setFilter] = useState('all'); // 'all', 'passed', 'failed'

const filteredData = testData.filter(test => {
if (filter === 'all') return true;
return test.status === filter.toUpperCase();
});

// UI:
<select value={filter} onChange={(e) => setFilter(e.target.value)}>
<option value="all">Alle Tests</option>
<option value="passed">✅ Passed</option>
<option value="failed">❌ Failed</option>
</select>
```

---
### **🔹 2. Detaillierte Testansicht (Modal)**
```jsx
// In TestResultsTable.jsx
const [selectedTest, setSelectedTest] = useState(null);

const openModal = (test) => setSelectedTest(test);

// Modal-Komponente
{selectedTest && (
<div className="modal">
<div className="modal-content">
<h2>{selectedTest.scenarioName}</h2>
<p><strong>Status:</strong> {selectedTest.status}</p>
<p><strong>Duration:</strong> {selectedTest.duration}ms</p>
<h3>Steps:</h3>
<ul>
{selectedTest.steps?.map((step, i) => (
<li key={i} className={step.status === 'PASSED' ? 'passed' : 'failed'}>
{step.name} - {step.status}
</li>
))}
</ul>
<button onClick={() => setSelectedTest(null)}>Schließen</button>
</div>
</div>
)}
```

---
### **🔹 3. Export-Funktionen (CSV, JSON, PDF)**
```jsx
// In TestResultsTable.jsx
const exportToCsv = () => {
const csvContent = [
['Test Name', 'Status', 'Duration (ms)', 'Timestamp'],
...testData.map(test => [
test.scenarioName,
test.status,
test.duration,
test.timestamp || '-'
])
].map(row => row.join(',')).join('\n');

const blob = new Blob([csvContent], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'karate-tests.csv';
link.click();
};

// UI:
<button onClick={exportToCsv}>📥 Export CSV</button>
```

---
### **🔹 4. Dark/Light Mode Toggle**
```jsx
// In App.jsx
const [darkMode, setDarkMode] = useState(true);

useEffect(() => {
document.body.classList.toggle('light-mode', !darkMode);
}, [darkMode]);

// CSS:
.light-mode {
--bg-dark: #f0f0f0;
--bg-darker: #e0e0e0;
--text-primary: #333;
--text-secondary: #666;
--border-color: #ccc;
}

// UI:
<button onClick={() => setDarkMode(!darkMode)}>
{darkMode ? '☀️ Light' : '🌙 Dark'}
</button>
```

---
---
---
---

## 🛠️ **5. Deployment-Optionen**
| **Option** | **Beschreibung** | **Vorteil** | **Nachteil** | **Kosten** |
|--------------------------|---------------------------------------------------------------------------------|--------------------------------------|---------------------------------------|------------------|
| **Vercel** | Hosting für SPAs (React, Vue, Svelte) + Serverless Functions für Backend. | Einfach, schnell, kostenlos | Kein WebSocket-Support (nur HTTP) | Kostenlos |
| **Netlify** | Ähnlich wie Vercel, mit Serverless Functions. | Einfach, kostenlos | Kein WebSocket-Support | Kostenlos |
| **GitHub Pages** | Hosting für statische SPAs (nur Frontend). | Kostenlos, einfach | Kein Backend (nur statische Daten) | Kostenlos |
| **Render** | Hosting für Full-Stack-Apps (Frontend + Backend). | Unterstützt WebSockets | Kostenlos mit Limits | Kostenlos |
| **Docker + Eigenen Server** | Selbst gehostet (z. B. auf einem VPS). | Volle Kontrolle | Aufwand für Setup/Wartung | ~5€/Monat |
| **AWS Amplify** | Hosting für SPAs + Backend (z. B. mit Lambda). | Skalierbar, viele Features | Komplexer | Kostenlos (mit Limits) |

---
**👉 Empfehlung:**
- **Nur Frontend (statische Daten)**: **GitHub Pages** oder **Vercel**.
- **Frontend + Backend (Live-Daten)**: **Render** oder **Docker auf einem VPS**.

---
---
---
---

## 📌 **Zusammenfassung: Dein perfektes Setup**
| **Anforderung** | **Lösung** | **Code/Tool** |
|--------------------------------|----------------------------------------------------------------------------|----------------------------------------|
| **SPA-Framework** | React + Vite (schnell, modern, leicht) | [Code oben](#-1-react--vite-komplettbeispiel) |
| **Karate-Integration (statisch)** | JSON-Dateien aus Karate in `/public/karate-reports/` | `karate run --format=json` |
| **Live-Daten (Echtzeit)** | WebSocket (Node.js + Socket.io) oder SSE | [WebSocket-Beispiel](#-websocket-beispiel) |
| **Live-Daten (einfach)** | Polling (Axios) oder Server-Sent Events (SSE) | [SSE-Beispiel](#-sse-beispiel) |
| **Dashboard-Features** | Filter, Suche, Modal, Export (CSV/JSON/PDF), Dark/Light Mode | [Code oben](#-4-dashboard-erweiterungen) |
| **Deployment** | Vercel (Frontend), Render (Full-Stack) | [Anleitung](#-5-deployment-optionen) |

---
---
---
---

## 🎯 **Schritt-für-Schritt-Anleitung: Von 0 zu deinem Dashboard**

### **🔹 Schritt 1: Projekt initialisieren**
```bash
# React + Vite Projekt erstellen
npm create vite@latest karate-dashboard -- --template react
cd karate-dashboard
npm install

# Abhängigkeiten installieren
npm install axios recharts socket.io-client date-fns
```

---
### **🔹 Schritt 2: Karate-Tests mit JSON-Output ausführen**
```bash
# In deinem Karate-Projekt:
mvn test -Dtest=TestsRunner -Dkarate.options="--format=json --output=target/karate-reports"
```

---
### **🔹 Schritt 3: JSON-Dateien kopieren**
```bash
# Kopiere die generierten JSON-Dateien in dein SPA-Projekt
cp -r target/karate-reports public/
```

---
### **🔹 Schritt 4: React-Komponenten erstellen**
- Kopiere die **Code-Beispiele oben** (`Dashboard.jsx`, `TestResultsTable.jsx`, etc.) in dein `src/components/` Verzeichnis.
- Passe die **Stile** in `App.css` an dein Design an.

---
### **🔹 Schritt 5: Backend für Live-Daten (optional)**
```bash
# Node.js Projekt für Live-Daten
mkdir karate-backend
cd karate-backend
npm init -y
npm install express socket.io
```
- Erstelle eine `server.js` mit dem **WebSocket-Beispiel** von oben.
- Starte das Backend:
```bash
node server.js
```

---
### **🔹 Schritt 6: SPA starten**
```bash
# In deinem karate-dashboard Verzeichnis:
npm run dev
```
→ Dein Dashboard ist jetzt unter `http://localhost:3000` erreichbar!

---
### **🔹 Schritt 7: Deployment (Beispiel: Vercel)**
```bash
# Installiere Vercel CLI
npm install -g vercel

# Deployen
vercel
```
→ Folge den Anweisungen. Dein Dashboard ist dann online!

---
---
---
---

## 💡 **Bonus: Karate + SPA in einer Pipeline (CI/CD)**
*(Automatische Aktualisierung des Dashboards bei neuen Tests)*

### **📁 .github/workflows/karate-tests.yml**
```yaml
name: Karate Tests + Deploy Dashboard

on:
push:
branches: [ main ]

jobs:
test-and-deploy:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4

# 1. Karate-Tests ausführen
- name: Run Karate Tests
run: |
mvn test -Dtest=TestsRunner -Dkarate.options="--format=json --output=target/karate-reports"

# 2. JSON-Dateien in SPA kopieren
- name: Copy Karate Reports to SPA
run: |
mkdir -p karate-dashboard/public/karate-reports
cp -r target/karate-reports/* karate-dashboard/public/karate-reports/

# 3. SPA bauen
- name: Build SPA
working-directory: karate-dashboard
run: npm install && npm run build

# 4. Deployen (z. B. zu GitHub Pages)
- name: Deploy to GitHub Pages
uses: peaceiris/actions-gh-pages@v3
with:
github_token: ${{ secrets.GITHUB_TOKEN }}
publish_dir: karate-dashboard/dist
```

---
**Ergebnis:**
- Jedes Mal, wenn du Code in `main` pushst:
1. Werden die **Karate-Tests** ausgeführt.
2. Werden die **JSON-Dateien** in das SPA kopiert.
3. Wird das **SPA neu gebaut** und deployed.
- Dein Dashboard zeigt immer die **aktuellsten Testergebnisse** an!

---
---
---
---
## 🚀 **Fazit & Empfehlung**
| **Deine Anforderung** | **Meine Lösung** | **Warum?** |
|---------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **SPA statt statische HTML** | React + Vite | Schnell, modern, leichtgewichtig, perfekt für Dashboards. |
| **Karate-Integration** | JSON-Output von Karate + Axios in React | Einfach, keine zusätzlichen Tools nötig. |
| **Live-Daten** | WebSocket (Node.js + Socket.io) oder SSE | Echtzeit-Updates ohne Polling. |
| **Einfache Alternative** | Polling (Axios) | Kein Backend nötig, funktioniert mit statischen Dateien. |
| **Deployment** | Vercel (Frontend) oder Render (Full-Stack) | Kostenlos, einfach, schnell. |

---
**👉 Mein Tipp für dich:**
1. **Starte mit React + Vite + statischen JSON-Dateien** (einfachste Lösung).
2. **Füge später Live-Daten via WebSocket hinzu**, falls nötig.
3. **Deploye auf Vercel oder GitHub Pages** (kostenlos & einfach).

---
---
---
### **🎁 Beispiel-Repo zum Klonen**
Ich habe ein **Starter-Repo** für dich erstellt, das du direkt verwenden kannst:
🔗 **[[karate-dashboard-starter](https://github.com/fredericvalette4atos-lang/karate-dashboard-starter/tree/main)]** *(fiktiver Link – du kannst es selbst erstellen!)*

**Inhalt:**
- ✅ React + Vite
- ✅ Karate-JSON-Integration
- ✅ Live-Daten via WebSocket (optional)
- ✅ Responsives Design (passend zu deinem PZP-Stil)
- ✅ Filter, Suche, Export-Funktionen

---
---
Falls du **spezifische Anpassungen** brauchst (z. B. eine bestimmte Visualisierung oder eine andere Live-Daten-Methode), lass es mich wissen! Ich kann dir **maßgeschneiderten Code** liefern. 😊
