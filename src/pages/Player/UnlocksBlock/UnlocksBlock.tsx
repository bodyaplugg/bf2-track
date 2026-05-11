import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { unlocksConfig } from '../../../utils/config';

import './UnlocksBlock.css';

const UnlocksBlock = () => {
    const { unlocksData } = useSelector((state: RootState) => state.player);
    if (!unlocksData || !unlocksData.data) return null;

    const unlockedIds = new Set(unlocksData.data.map((u: any) => u.id));

    return (
        <ul className="stats-card unlocks-card">
            <h3>Розблокована зброя</h3>

            <div className="unlocks-grid">
                {unlocksConfig.map(unlock => {
                    const isUnlocked = unlockedIds.has(Number(unlock.id));

                    const bgPosition = `0px -${unlock.spriteIdx * 32}px`;

                    return (
                        <li
                            key={unlock.id}
                            className={`unlock-item ${!isUnlocked ? 'unlock-locked' : ''}`}
                            title={isUnlocked ? `${unlock.name}: Розблоковано` : `${unlock.name}: Заблоковано`}
                        >
                            <div className="unlock-icon-container">
                                <div
                                    className="unlock-sprite sprite-color"
                                    style={{
                                        backgroundPosition: bgPosition,
                                        backgroundImage: `url('/assets/img/unlocks/unlocks1.png')`
                                    }}
                                />
                                <div
                                    className="unlock-sprite sprite-grey"
                                    style={{
                                        backgroundPosition: bgPosition,
                                        backgroundImage: `url('/assets/img/unlocks/unlocks0.png')`
                                    }}
                                />
                            </div>

                            <div className="unlock-name">{unlock.name}</div>
                        </li>
                    );
                })}
            </div>
        </ul>
    );
};

export default UnlocksBlock;