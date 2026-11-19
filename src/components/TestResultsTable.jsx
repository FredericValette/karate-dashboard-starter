import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const TestResultsTable = ({ isLive, data, loading, error }) => {
  const [liveRows, setLiveRows] = useState([]);

  // Live-Daten (WebSocket) sammeln und Axios-Intervall dem Hook ueberlassen
  useEffect(() => {
    if (!isLive) return undefined;
    const socket = new WebSocket('ws://localhost:8080/karate-live');

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setLiveRows((prev) => [...prev, parsed]);
    };
    socket.onerror = (err) => console.error(err);

    return () => socket.close();
  }, [isLive]);

  // Beim Verlassen des Live-Modus: gesammelte Live-Zeilen verwerfen
  useEffect(() => {
    if (!isLive) setLiveRows([]);
  }, [isLive]);

  if (loading && !isLive) return <div className="loading">Loading test data...</div>;

  const rows = isLive ? [...data, ...liveRows] : data;

  return (
    <div className="test-results">
      <h2>Test Results</h2>
      {error && <div className="error">{error}</div>}
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
          {rows.map((test, index) => (
            <tr key={index} className={test.status === 'PASSED' ? 'passed' : 'failed'}>
              <td>{test.name || test.scenarioName}</td>
              <td>
                <span className={`status-badge ${test.status === 'PASSED' ? 'passed' : 'failed'}`}>
                  {test.status}
                </span>
              </td>
              <td>{test.duration || test.time || 'N/A'}</td>
              <td>
                {test.timestamp
                  ? format(new Date(test.timestamp), 'HH:mm:ss')
                  : 'N/A'}
              </td>
              <td>{test.error ? test.error.message : '-'}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="loading">Keine Testdaten</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TestResultsTable;
