import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  // BASE_URL ist '/' lokal im Dev-Server und '/karate-dashboard-starter/'
  // auf GitHub Pages - so matcht Route path="/" auf beiden.
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
