import React from 'react';
import './Home.css';
import LeaderboardCard from './LeaderboardCard/LeaderboardCard'
import FavoriteServers from "./FavoriteServers/FavoriteServers";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <FavoriteServers/>
            <LeaderboardCard/>
        </div>
    );
}

export default Home;