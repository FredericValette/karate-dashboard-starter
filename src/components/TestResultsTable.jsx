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
