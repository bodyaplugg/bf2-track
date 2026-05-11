import React from "react";

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

import { safeNum, toHours, formatDate } from "../../../utils/formatters";
import AwardImage from '../../../components/AwardImage'

import './StatsCard.css';

interface CardProps {
    title: string;
    config: { id: number; name: string; awardId: string; spriteIdx: number }[];
}

const getMedalLabel = (level: number) => {
    const labels = ['-', 'Базовий', 'Ветеран', 'Експерт'];
    return labels[level] || labels[0];
};

const StatsCard = ({title, config}: CardProps) => {
    const { data, awardsData } = useSelector((state: RootState) => state.player);

    if (!data) return null;

    const player = data.data
    const awards  = awardsData.data;

    return (
        <ul className="stats-card">
            <h3>{title}</h3>
            {config.map((config) => {

                const cl = player?.kits?.find((c: any) => c.id === config.id);
                if (!cl || safeNum(cl.time) === 0) return null;

                const relevantAwards = awards?.filter((a: any) => a.award == config.awardId);
                const bestAward = relevantAwards?.sort((a: any, b: any) => safeNum(b.level) - safeNum(a.level))[0];

                const medalLevel = safeNum(bestAward?.level);
                const vTime = safeNum(cl.time);

                return (
                    <li className="award-stats-item" key={config.id} style={{  }}>
                        <div className="other-header">
                            <span>{config.name}</span>
                            <b>{toHours(vTime)}</b>
                        </div>

                        <div className="award-stats-info">
                            <div className="medal-sprite-container">
                                <AwardImage index={config.spriteIdx} type="badge" medalLevel={medalLevel} />
                                <div className="subtext">{getMedalLabel(medalLevel)}</div>
                            </div>

                            <div>
                                <div className="other-stats-row">
                                    <span>Вбивств: <b>{cl.kills}</b></span>
                                    <span>Смертей: <b>{cl.deaths}</b></span>
                                    <span>У/С: <b>
                                {safeNum(cl.deats) === 0 ? cl.kills : (safeNum(cl.kills) / safeNum(cl.deaths)).toFixed(2)}
                            </b></span>
                                </div>
                                {bestAward && (
                                    <div className="subtext">
                                        Отримано: {formatDate(bestAward.when)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    )
}

export default StatsCard