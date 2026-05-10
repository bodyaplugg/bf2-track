import React from 'react';
import './Home.css';
import LeaderboardCard from './LeaderboardCard/LeaderboardCard'

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <LeaderboardCard/>
        </div>
    );
}

export default Home;