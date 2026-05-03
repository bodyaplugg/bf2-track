import React from 'react';

interface PlayerResult {
    id: string;
    nickname: string;
    rank: number;
    country: string;
    isOnline: boolean;
    currentServer?: string;
    totalScore: number;
}

const SearchResultItem: React.FC<{ player: PlayerResult }> = ({ player }) => {
    return (
        <div className="result-item">
            <div className="player-info">
                <img src={`/assets/img/ranks/${player.rank}.png`} alt="rank" className="rank-mini" />
                <img src={`https://flagcdn.com/24x18/${player.country.toLowerCase()}.png`} alt="flag" />
                <span className="nickname">{player.nickname}</span>
            </div>

            <div className="status-info">
                {player.isOnline ? (
                    <div className="status-online">
                        <span className="pulse-dot"></span>
                        <span className="server-name">{player.currentServer}</span>
                    </div>
                ) : (
                    <span className="status-offline">Offline</span>
                )}
            </div>

            <div className="score-info">
                <span className="label">Score:</span>
                <span className="value">{player.totalScore.toLocaleString()}</span>
            </div>
        </div>
    );
};