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
