import React, {useEffect, useState} from 'react';
import {getRisingLeaderboard, getScoreLeaderboard} from '../../../service/stats'
import './LeaderboardCard.css'
import {Link} from "react-router-dom";

interface LeaderboardPlayer {
    pid: number;
    nick: string;
    rank: number;
    country_code: string;
    score: number;
}

const LeaderboardCard = () => {
    const [leaders, setLeaders] = useState<LeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const data: any = await getRisingLeaderboard('bf2hub');
                setLeaders(data.entries);
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
                <h3>Кращі гравці за останній тиждень</h3>
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
                                        src={`/assets/img/ranks/${player.rank}.png`}
                                        alt="rank"
                                        className="mini-rank"
                                    />
                                </td>
                                <td className="nick-cell"><b> <Link to={`/player/${player.pid}?project=bf2hub`}>{player.nick}</Link></b></td>
                                <td className="flag-cell">
                                    <img
                                        src={`https://flagsapi.com/${player.country_code}/shiny/32.png`}
                                        alt={player.country_code}
                                        title={player.country_code}
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