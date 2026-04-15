import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ReviewBridgeHome from './ReviewBridgeHome';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ReviewBridgeHome />} />
    </Routes>
  );
}

export default App;
