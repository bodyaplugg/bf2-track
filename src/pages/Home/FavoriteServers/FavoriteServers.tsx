import React, { useEffect, useState } from 'react';
import { getServer } from '../../../utils/live';
import {Link} from "react-router-dom";
import './FavoriteServers.css'

interface ServerData {
    ip: string;
    port: string;
    name: string;
    numPlayers: number;
    maxPlayers: number;
    mapName: string;
}

const FavoriteServers: React.FC = () => {
    const [servers, setServers] = useState<ServerData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            const favIps: string[] = JSON.parse(localStorage.getItem('favoriteServers') || '[]');

            if (favIps.length === 0) {
                setServers([]);
                setLoading(false);
                return;
            }

            try {
                const serverPromises = favIps.map(async (address) => {
                    const [ip, port] = address.split(':');
                    const data = await getServer(ip, port);
                    return data as ServerData | null;
                });

                const results = await Promise.all(serverPromises);

                const validServers = results.filter((s): s is ServerData => s !== null);

                setServers(validServers);
            } catch (error) {
                console.error("Помилка при отриманні серверів: ", error);
                setServers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="leaderboard-card fav-servers-card">
            <div className="card-header">
                <h3>ВИБРАНІ СЕРВЕРИ</h3>
            </div>

            <div className="leaderboard-scroll-area">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>СЕРВЕР</th>
                            <th className="table-center">ГРАВЦІ</th>
                            <th className="table-right">МАПА</th>
                        </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={3} className="status-msg">Завантаження...</td></tr>
                    ) : servers.length === 0 ? (
                        <tr><td colSpan={3} className="status-msg">Список порожній</td></tr>
                    ) : (
                        servers.map((server) => (
                            <tr key={`${server.ip}:${server.port}`}>
                                <td className="nick-cell">
                                    <b title={server.name}> <Link to={`/servers/${server.ip}/${server.port}`}> {server.name.substring(0, 25)}</Link>{server.name.length > 25 ? '...' : ''}</b>
                                    <div className="ip-text">{server.ip}:{server.port}</div>
                                </td>
                                <td className="table-center">
                                        <span>
                                            {server.numPlayers}
                                        </span>
                                    <span> / {server.maxPlayers}</span>
                                </td>
                                <td className="table-right">
                                    {server.mapName}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FavoriteServers;