import React from 'react';
import './App.css';
import './globals.css';
import Navbar from "./components/Navbar";
import Home from './pages/Home'
import Player from './pages/Player/Player'
import SearchResults from './pages/SearchResults/SearchResults';
import ServerList from './pages/ServerList/ServerList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <BrowserRouter>
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player/:pid" element={<Player />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/servers" element={<ServerList />} />
            </Routes>

        </div>
      </BrowserRouter>
  );
}

export default App;
