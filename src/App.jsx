// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MiracleWorksApp from './components/MiracleWorksApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to jewelry store demo */}
        <Route path="/" element={<Navigate to="/jewelry-store" replace />} />
        
        {/* New generic routes */}
        <Route path="/jewelry-store" element={<MiracleWorksApp store="jewelry-store" />} />
        <Route path="/fashion-store" element={<MiracleWorksApp store="fashion-store" />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/zamels" element={<Navigate to="/jewelry-store" replace />} />
        <Route path="/sydneystreet" element={<Navigate to="/fashion-store" replace />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/jewelry-store" replace />} />
      </Routes>
    </Router>
  );
}

export default App;