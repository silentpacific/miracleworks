// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MiracleWorksApp from './components/MiracleWorksApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to Zamels demo */}
        <Route path="/" element={<Navigate to="/zamels" replace />} />
        
        {/* Store-specific routes */}
        <Route path="/zamels" element={<MiracleWorksApp store="zamels" />} />
        <Route path="/sydneystreet" element={<MiracleWorksApp store="sydneystreet" />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/zamels" replace />} />
      </Routes>
    </Router>
  );
}

export default App;