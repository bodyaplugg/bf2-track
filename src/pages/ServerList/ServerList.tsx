import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServers } from '../../service/stats';
import './ServerList.css';
import {gamemodes, gametypes} from "../../utils/config";
import Loader from "../../components/Loader";
import ErrorCard from "../../components/ErrorCard";

interface Server {
    ip: string;
    port: number;
    name: string;
    mapName: string;
    numPlayers: number;
    maxPlayers: number;
    gameType: string;
    gameVariant: string;
    ranked: boolean;
    voip: boolean;
    anticheat: boolean;
}

interface ServersApiResponse {
    servers: Server[];
    cursor: string | null;
    hasMore: boolean;
}

const ServerList: React.FC = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [lastServerIp, setLastServerIp] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    const perPage = 20;

    const fetchServers = async (cursor?: string, after?: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getServers(perPage, cursor, after) as ServersApiResponse | null;
            if (response) {
                setServers(prevServers => (cursor || after) ? [...prevServers, ...response.servers] : response.servers);
                setHasMore(response.hasMore);
                
                if (response.hasMore) {
                    setNextCursor(response.cursor ?? undefined);
                    if (response.servers.length > 0) {
                        setLastServerIp(response.servers[response.servers.length - 1].ip + ':' + response.servers[response.servers.length - 1].port);
                    }
                }
            } else {
                setHasMore(false);
            }
        } catch (err: any) {
            let errorMessage = 'Failed to fetch server list.';
            if (err.data && err.data.error) {
                errorMessage += ` (API Error: ${err.data.error})`;
            }
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServers();
        document.title = `BF2-track | Сервери`
    }, []);


    const handleLoadMore = () => {
        if (hasMore && nextCursor && lastServerIp) {
            fetchServers(nextCursor, lastServerIp);
        }
    };

    return (
        <div className="server-list-container">
            <h1>Server List</h1>
            <div className="server-table">
                <div className="server-table-header">
                    <div className="header-item server-icons"></div>
                    <div className="header-item server-name">Назва</div>
                    <div className="header-item server-players">Гравці</div>
                    <div className="header-item server-map">Мапа</div>
                    <div className="header-item server-mod">Мод</div>
                    <div className="header-item server-gametype">Режим</div>
                </div>
                <div className="server-table-body">
                    {servers.map(server => (
                        <div key={`${server.ip}:${server.port}`} className="server-row">
                            <div className="server-cell server-icons">
                                <img src={`/assets/img/icons/${server.ranked ? '' : 'un'}ranked.png`} alt={server.ranked ? 'Ranked' : 'Unranked'} title={server.ranked ? 'Ranked' : 'Unranked'} />
                                {server.voip 
                                    ? <span className="material-symbols-outlined" title="VOIP enabled">headset</span> 
                                    : <span className="material-symbols-outlined" title="VOIP disabled">headset_off</span>
                                }
                                <img src="/assets/img/icons/pb.png" alt={server.anticheat ? "PunkBuster Enabled" : "PunkBuster Disabled"} title={server.anticheat ? "PunkBuster Enabled" : "PunkBuster Disabled"} className={`pb-icon ${!server.anticheat ? 'pb-icon-disabled' : ''}`} />
                            </div>
                            <div className="server-cell server-name">
                                <Link to={`/servers/${server.ip}/${server.port}`}>{server.name}</Link>
                            </div>
                            <div className="server-cell server-players">{server.numPlayers}/{server.maxPlayers}</div>
                            <div className="server-cell server-map">{server.mapName}</div>
                            <div className="server-cell server-mod">{gametypes[server.gameVariant] || server.gameVariant}</div>
                            <div className="server-cell server-gametype">{gamemodes[server.gameType] || server.gameType}</div>
                        </div>
                    ))}
                </div>
            </div>
            {isLoading && <Loader/>}
            {error && <ErrorCard msg={'Помилка: ' + error + '.'}/>}
            <div className="pagination-controls">
                {hasMore && !isLoading && (
                    <button onClick={handleLoadMore} disabled={!nextCursor || !lastServerIp}>
                        Більше...
                    </button>
                )}
            </div>
        </div>
    );
};

export default ServerList;
