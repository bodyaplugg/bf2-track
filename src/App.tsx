import React from 'react';
import './App.css';
import Navbar from "./components/Navbar";

function App() {
    const handlePlayerSearch = (nickname: string, project: string) => {

    };
  return (
    <div className="App">
        <Navbar onSearch={handlePlayerSearch}></Navbar>
    </div>
  );
}

export default App;
