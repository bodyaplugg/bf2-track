import React from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import Home from './pages/Home'
import Player from './pages/Player'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    const handlePlayerSearch = (nickname: string, project: string) => {

    };
  return (
      <BrowserRouter>
        <div className="App">
            <Navbar onSearch={handlePlayerSearch}></Navbar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player/:pid" element={<Player />} />
            </Routes>

        </div>
      </BrowserRouter>
  );
}

export default App;
