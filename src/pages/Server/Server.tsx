import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getServer } from '../../utils/live';
import './Server.css';
import { Link } from 'react-router-dom';
import {gamemodes, gametypes} from "../../utils/config";
import Loader from '../../components/Loader'
import ErrorCard from "../../components/ErrorCard";
import FavoriteButton from "./FavoriteButton";

interface Player {
    pid: number;
    name: string;
    tag: string;
    score: number;
    kills: number;
    deaths: number;
    ping: number;
    team: number;
    teamLabel: string;
    aibot: boolean;
}

interface Server {
    ip: string;
    port: number;
    name: string;
    mapName: string;
    mapSize: number;
    numPlayers: number;
    maxPlayers: number;
    gameType: string;
    gameVariant: string;
    gameVersion: string;
    ranked: boolean;
    anticheat: boolean;
    battlerecorder: boolean;
    voip: boolean;
    password?: boolean;
    timelimit: number;
    roundsPerMap: number;
    demoIndex?: string;
    demoDownload?: string;
    autobalance?: boolean;
    friendlyfire?: boolean;
    tkmode?: string;
    startdelay?: number;
    spawntime?: number;
    sponsorText?: string;
    sponsorLogoUrl?: string;
    communityLogoUrl?: string;
    scorelimit?: number;
    ticketratio?: number;
    teamratio?: number;
    team1?: string;
    team2?: string;
    pure?: boolean;
    globalUnlocks?: boolean;
    reservedSlots?: number;
    dedicated?: boolean;
    os?: string;
    bots?: boolean;
    fps?: number;
    plasma?: boolean;
    coopBotRatio?: number;
    coopBotCount?: number;
    coopBotDiff?: number;
    noVehicles?: number;
    joinLink?: string;
    joinLinkWeb?: string;
    variables?: Record<string, string>;
    teams?: { index: number; label: string }[];
    players?: Player[];
}

const armies: Record<string, string> = {
    "us": "us",
    "mec": "mec",
    "eu": "eu",
    "sas": "sas",
    "seals": "seal",
    "seal": "seal",
    "mecsf": "mecsf",
    "spetz": "spetz",
    "chinsurgent": "Chinsurgent",
    "ch": "ch",
    "meinsurgent": "MEInsurgent",
};

const getArmyFlag = (teamLabel: string) => {
    const label = teamLabel.toLowerCase();
    for (const key in armies) {
        if (label.includes(key)) {
            return `/assets/img/armies/${armies[key]}.png`;
        }
    }
    return '/assets/img/armies/unknown.png';
};

const ServerPage: React.FC = () => {
    const { ip, port } = useParams<{ ip: string; port: string }>();
    const [server, setServer] = useState<Server | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServer = async () => {
            if (!ip || !port) {
                return;
            }
            setIsLoading(true);
            setError(null);

            try {
                const response: any = await getServer(ip, port);
                setServer(response);
            } catch (err: any) {
                let errorMessage = 'Failed to fetch server details.';
                if (err.data && err.data.error) {
                    errorMessage += ` (API Error: ${err.data.error})`;
                }
                setError(errorMessage);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServer();
    }, [ip, port]);

    if (isLoading) {
        return <Loader/>;
    }

    if (error) {
        return <ErrorCard msg={'Помилка: ' + error + '.'}/>;
    }

    if (!server) {
        return <ErrorCard msg="Сервер не знайдено."/>;
    }

    const mapDetails = [
        { label: 'Режим', value: gamemodes[server.gameType] || server.gameType },
        { label: 'Обмеження по часу', value: server.timelimit ? `${server.timelimit / 60}m` : '∞' }
    ];

    const settings = [
        { label: 'Мод', value: gametypes[server.gameVariant] || server.gameVariant },
        { label: 'Ранговий', value: server.ranked ? 'Так' : 'Ні', className: server.ranked ? "status-on" : "status-off" },
        { label: 'Античит', value: server.anticheat ? 'Так' : 'Ні', className: "status-neutral" },
        { label: 'Дружній вогонь', value: server.friendlyfire ? 'Так' : 'Ні' },
        { label: 'Автобаланс', value: server.autobalance ? 'Так' : 'Ні' },
        { label: 'Battlerecorder', value: server.battlerecorder ? 'Так' : 'Ні' },
        { label: 'Боти', value: server.bots ? 'Так' : 'Ні' },
    ];

    return (
        <div className="server-page-container">
            <div className="server-hero section">
                <div className="hero-main">
                    <h1>{server.name}</h1>
                    <div className="hero-meta">
                        <span>{server.ip}:{server.port}</span>
                        <span className="separator">•</span>
                        <span>{server.gameVersion}</span>
                        <FavoriteButton serverIp={server.ip+':'+server.port}/>
                    </div>
                </div>
                <div className="hero-actions">
                    {server.joinLink && <a href={server.joinLink} className="btn btn-primary btn-lg">Приєднатися</a>}
                    <div className="social-links">
                        {server.variables?.discord && <a href={server.variables.discord} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Discord</a>}
                        {server.variables?.website && <a href={server.variables.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Сайт</a>}
                    </div>
                </div>
            </div>

            <div className="server-content">
                <div className="main-content">
                    <div className="section player-section">
                        <div className="section-header">
                            <h2>Гравці</h2>
                            <span className="player-count">{server.numPlayers} / {server.maxPlayers}</span>
                        </div>

                        <div className="team-columns">
                            {server.teams?.map(team => (
                                <div key={team.index} className="team-column">
                                    <h3 className={`team-name team-${team.index}`}>
                                        <img src={getArmyFlag(team.label)} alt={team.label} className="army-flag" />
                                        {team.label}
                                    </h3>
                                    <table className="player-table">
                                        <thead>
                                        <tr>
                                            <th>Гравець</th>
                                            <th className="text-right"><img className="tab-icon" src="/assets/img/icons/score.png" alt="Score"/></th>
                                            <th className="text-right"><img className="tab-icon" src="/assets/img/icons/kills.png" alt="Kills"/></th>
                                            <th className="text-right"><img className="tab-icon" src="/assets/img/icons/deaths.png" alt="Deaths"/></th>
                                            <th className="text-right"><img className="tab-icon" src="/assets/img/icons/ping.png" alt="Ping"/></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {server.players?.filter(p => p.team === team.index).map((player, playerIndex) => (
                                            <tr key={playerIndex}>
                                                <td>
                                                    <Link to={`/player/${player.pid}?project=bf2hub`} className="player-link">
                                                        {player.name}
                                                        {player.aibot && <span className="bot-tag">BOT</span>}
                                                    </Link>
                                                </td>
                                                <td className="text-right font-mono">{player.score}</td>
                                                <td className="text-right font-mono">{player.kills}</td>
                                                <td className="text-right font-mono">{player.deaths}</td>
                                                <td className="text-right font-mono">{player.ping}мс</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="section map-card">
                        <h2>Деталі про мапу</h2>
                        <div className="map-info">
                            <div className="map-name">{server.mapName}</div>
                            <div className="map-size">Розмір: {server.mapSize}</div>
                        </div>
                        <div className="info-grid">
                            {mapDetails.map(detail => (
                                <div className="info-item" key={detail.label}>
                                    <label>{detail.label}</label>
                                    <span>{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section settings-card">
                        <h2>Налаштування</h2>
                        <div className="settings-list">
                            {settings.map(setting => (
                                <div className="setting-row" key={setting.label}>
                                    <span>{setting.label}</span>
                                    <span className={setting.className}>{setting.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerPage;
