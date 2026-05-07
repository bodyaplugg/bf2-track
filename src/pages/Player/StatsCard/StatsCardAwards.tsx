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

    const { grouped } = data
    const { awards } = awardsData;

    return (
        <ul className="stats-card">
            <h3>{title}</h3>
            {config.map((config) => {

                const cl = grouped?.classes?.find((c: any) => c.id === config.id);
                if (!cl || safeNum(cl.tm) === 0) return null;

                const relevantAwards = awards?.filter((a: any) => a.award === config.awardId);
                const bestAward = relevantAwards?.sort((a: any, b: any) => safeNum(b.level) - safeNum(a.level))[0];

                const medalLevel = safeNum(bestAward?.level);
                const vTime = safeNum(cl.tm);

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
                                    <span>Вбивств: <b>{cl.kl}</b></span>
                                    <span>Смертей: <b>{cl.dt}</b></span>
                                    <span>У/С: <b>
                                {safeNum(cl.dt) === 0 ? cl.kl : (safeNum(cl.kl) / safeNum(cl.dt)).toFixed(2)}
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