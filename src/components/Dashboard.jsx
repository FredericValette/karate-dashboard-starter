import React, { useState } from 'react';
import TestResultsTable from './TestResultsTable';
import LiveDataToggle from './LiveDataToggle';
import useKarateData from '../hooks/useKarateData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [isLive, setIsLive] = useState(false);
  const { reports, reportId, setReportId, data, loading, error, summary, chartData } = useKarateData();

  const activeLabel = (reports.find((r) => r.id === reportId) || {}).label || reportId || '...';

  return (
    <div className="dashboard">
      <header>
        <h1>🎯 Karate Test Dashboard</h1>
        <div className="header-controls">
          <div className="report-selector">
            <label htmlFor="report-select">📁 Report: </label>
            <select
              id="report-select"
              value={reportId || ''}
              onChange={(e) => setReportId(e.target.value)}
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label || r.id}
                </option>
              ))}
            </select>
          </div>
          <LiveDataToggle isLive={isLive} setIsLive={setIsLive} />
        </div>
      </header>

      <div className="metrics">
        <div className="metric-card">
          <h3>✅ Passed</h3>
          <p>{summary.passedPct}%</p>
          <small>{summary.passed} von {summary.total}</small>
        </div>
        <div className="metric-card">
          <h3>❌ Failed</h3>
          <p>{summary.failedPct}%</p>
          <small>{summary.failed} Tests</small>
        </div>
        <div className="metric-card">
          <h3>⚡ Duration</h3>
          <p>{summary.durationSeconds.toFixed(1)}s</p>
          <small>Gesamtdauer</small>
        </div>
        <div className="metric-card">
          <h3>📊 Tests</h3>
          <p>{summary.total}</p>
          <small>{activeLabel}</small>
        </div>
      </div>

      <div className="chart-container">
        <h2>Test Results Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="passed" stroke="#00ff80" name="Passed" />
            <Line type="monotone" dataKey="failed" stroke="#ff4444" name="Failed" />
            <Line type="monotone" dataKey="duration" stroke="#00b4ff" name="Dauer (s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <TestResultsTable isLive={isLive} data={data} loading={loading} error={error} />
    </div>
  );
};

export default Dashboard;
