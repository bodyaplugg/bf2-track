import React, {useEffect, useState} from 'react';
import {stats} from '../../../utils/stats/stats'
import './LeaderboardCard.css'
import {Link} from "react-router-dom";

interface LeaderboardPlayer {
    pid: number;
    nick: string;
    playerrank: number;
    countrycode: string;
    score: number;
}

const LeaderboardCard = () => {
    const [leaders, setLeaders] = useState<LeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const data = await stats.getLeaderboard();
                setLeaders(data.players);
                setLoading(false);
            } catch (error) {
                console.error("Не вдалось завантажити таблицю лідерів", error);
                setLoading(false);
            }
        };

        fetchLeaders();
    }, []);

    return (
        <div className="leaderboard-card">
            <div className="card-header">
                <h3>Таблиця лідерів</h3>
            </div>

            <div className="leaderboard-scroll-area">
                <table className="leaderboard-table">
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Завантаження...</td></tr>
                    ) : (
                        leaders.map((player, index) => (
                            <tr key={player.pid}>
                                <td className="pos-cell">{index + 1}</td>
                                <td className="rank-cell">
                                    <img
                                        src={`/assets/img/ranks/${player.playerrank}.png`}
                                        alt="rank"
                                        className="mini-rank"
                                    />
                                </td>
                                <td className="nick-cell"><b> <Link to={`/player/${player.pid}?project=bf2hub`}>{player.nick}</Link></b></td>
                                <td className="flag-cell">
                                    <img
                                        src={`https://flagsapi.com/${player.countrycode}/shiny/32.png`}
                                        alt={player.countrycode}
                                        title={player.countrycode}
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaderboardCard;