import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { safeNum, formatDate } from "../../../utils/formatters";
import AwardImage from "../../../components/AwardImage";
import {allAwardsConfig} from "../config";
import './AwardsBlock.css';

const AwardsBlock = () => {


    const playerState = useSelector((state: RootState) => state.player);
    const awards = playerState?.awardsData?.awards || [];

    const renderAward = (config: any) => {
        const playerAwards = awards.filter((a: any) => String(a.award) === String(config.id));
        const hasAward = playerAwards.length > 0;
        let maxLevel = hasAward ? Math.max(...playerAwards.map((a: any) => safeNum(a.level))) : 0;
        const totalCount = hasAward ? playerAwards.reduce((sum: number, a: any) => sum + safeNum(a.level), 0) : 0;
        const lastEarned = hasAward ? Math.max(...playerAwards.map((a: any) => safeNum(a.when))) : 0;
        if (hasAward && config.type === 'ribbon') maxLevel = 1;

        return (
            <li
                className={`award-item ${!hasAward ? 'award-locked' : ''}`}
                key={config.id}
            >
                <div className="award-icon-container">
                    <AwardImage index={config.spriteIdx} type={config.type} medalLevel={maxLevel} />

                    {config.type === 'medal' && totalCount > 1 && (
                        <span className="award-counter">
                            x{totalCount}
                        </span>
                    )}
                </div>
                <div className="award-name">
                    {config.name}
                </div>
                <div className="award-date">
                    {hasAward ? formatDate(lastEarned) : 'Не отримано'}
                </div>
            </li>
        );
    };

    if (!playerState) return null;

    return (
        <div className="stats-card awards-main-container">
            <div className="awards-section">
                {['badge', 'medal', 'ribbon'].map(type => (
                    <div key={type} className="award-group">
                        <h3 className="award-group-title">
                            {type === 'badge' ? 'Значки' : type === 'medal' ? 'Медалі' : 'Нашивки'}
                        </h3>
                        <ul className="awards-grid">
                            {allAwardsConfig.filter(a => a.type === type).map(renderAward)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AwardsBlock;