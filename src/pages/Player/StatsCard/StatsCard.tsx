import React from "react";
import {safeNum} from "../../../utils/formatters";

import './StatsCard.css';

interface CardProps {
    title: string;
    stats: { label: string; value: string }[];
}

const StatsCard = ({title, stats}: CardProps) => {

    return (
        <ul className="stats-card">
            <h3>{title}</h3>
            {stats.map((item, idx) => (
                <li className="data-row" key={idx}>
                    <span>{item.label}</span>
                    <b>{safeNum(item.value).toLocaleString()}</b>
                </li>
            ))}
        </ul>
    )
}

export default StatsCard