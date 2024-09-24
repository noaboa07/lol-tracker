import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import ProfilePage from './components/ProfilePage';
import SlideMenu from './components/SlideMenu';

function App() {
  return (
    <Router>
      <div className="app">
        <SlideMenu /> {/* Slide-out menu */}
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:puuid/:name/:tag" element={<ProfilePage />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;