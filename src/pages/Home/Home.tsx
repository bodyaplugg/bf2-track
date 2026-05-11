import React, { useEffect, useState } from 'react';
import './Home.css';
import LeaderboardCard from './LeaderboardCard/LeaderboardCard';
import FavoriteServers from "./FavoriteServers/FavoriteServers";
import { getInfo } from "../../service/stats";

interface NetworkInfo {
    players: number;
    servers: number;
}

const Home: React.FC = () => {
    const [info, setInfo] = useState<NetworkInfo>({ players: 0, servers: 0 });

    useEffect(() => {
        const fetchNetworkInfo = async () => {
            try {
                const data: any = await getInfo();
                setInfo({
                    players: data.players || 0,
                    servers: data.servers || 0
                });
            } catch (error) {
                console.error("Failed to fetch network info", error);
            }
        };

        fetchNetworkInfo();

        const interval = setInterval(fetchNetworkInfo, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-container">
            <div className="network-stats-header">
                <div className="stat-item">
                    <span className="stat-label">ГРАВЦІВ ОНЛАЙН:</span>
                    <span className="stat-value">{info.players.toLocaleString()}</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-label">АКТИВНИХ СЕРВЕРІВ:</span>
                    <span className="stat-value">{info.servers.toLocaleString()}</span>
                </div>
            </div>

            <FavoriteServers />
            <LeaderboardCard />
        </div>
    );
}

export default Home;