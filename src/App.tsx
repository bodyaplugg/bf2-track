import React from 'react';
import './App.css';
import './globals.css';
import Navbar from "./components/Navbar";
import Home from './pages/Home'
import Player from './pages/Player/Player'
import SearchResults from './pages/SearchResults/SearchResults';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    const handlePlayerSearch = (nickname: string, project: string) => {
        // This function can be removed if not used elsewhere
    };
  return (
      <BrowserRouter>
        <div className="App">
            <Navbar onSearch={handlePlayerSearch}></Navbar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player/:pid" element={<Player />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>

        </div>
      </BrowserRouter>
  );
}

export default App;
