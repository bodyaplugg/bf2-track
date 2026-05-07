import { formatDate } from '../../../utils/formatters'
import {ranksConfig} from "../config";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import { Link } from "react-router-dom";

import './PlayerHero.css';

const PlayerHero = ({project}: any) => {
    const { data, liveData } = useSelector((state: RootState) => state.player);
    const { player } = data
    const live = liveData
    const currentRank = ranksConfig.find(r => r.id === Number(player.rank)) || ranksConfig[0];

    const nextRank = ranksConfig.find(r => r.requiredXP > currentRank.requiredXP);

    let progressPercent = 100;

    if (nextRank) {
        const minXP = currentRank.requiredXP;
        const maxXP = nextRank.requiredXP;

        const earned = player.scor - minXP;
        const totalNeeded = maxXP - minXP;

        progressPercent = Math.min(Math.max((earned / totalNeeded) * 100, 0), 100);
    }

    return (
        <div className="player-hero">
            <div className="rank-section">
                <div className="rank-big">
                    <img
                        src={`/assets/img/ranks/${player.rank}.png`}
                        alt="Rank"
                        onError={(e) => (e.currentTarget.src = '/assets/img/ranks/0.png')}
                    />
                </div>

                <div className="rank-progress-block">
                    <span className="rank-name">{currentRank.name}</span>
                    <div className="rank-progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${nextRank ? progressPercent : 100}%` }}
                        ></div>
                        <span className="progress-text">
                            {nextRank
                                ? `${player.scor.toLocaleString()} / ${nextRank.requiredXP.toLocaleString()} XP`
                                : 'MAX RANK'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="nick-info">
                <h1>{player.nick}</h1>
                <div className="pid-tag">PID: {player.pid} | {project.toUpperCase()}</div>
                <div className="player-dates">
                    <span>Служить з: <b>{formatDate(player.jond)}</b></span>
                    <span>Остання битва: <b>{formatDate(player.lbtl)}</b></span>
                </div>
            </div>

            <div className={`server-info ${live ? 'online' : 'offline'}`}>
                {live ? (
                    <>
                        <div className="server-details">
                            <span className="label">ЗАРАЗ У БОЮ</span>
                            <Link to={`server/${live.ip}:${live.port}`} className="server-name" title={live.name}>{live.name}</Link>

                            <div className="server-meta">
                                <span className="map-name">{live.mapName}</span>
                                <span className="separator"> - </span>
                                <span className="player-count">{live.numPlayers}/{live.maxPlayers}</span>
                            </div>

                            <div className="player-status">
                                Команда: <strong>
                                {live.players.find((p: any) => p.name === player.nick || p.name.endsWith(player.nick))?.teamLabel || 'Невідомо'}
                            </strong>
                            </div>
                        </div>

                        <Link className="join-button" to={live.joinLink}>
                            ПРИЄДНАТИСЬ ДО БИТВИ
                        </Link>
                    </>
                ) : (
                    <div className="offline-status">
                        <span className="label">СТАТУС</span>
                        <span className="value offline">Оффлайн</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerHero;