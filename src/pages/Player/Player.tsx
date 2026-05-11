import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { getPlayerServer, getPlayer, getPlayerAwards, getPlayerUnlocks } from "../../service/stats";
import { safeNum, toHours } from "../../utils/formatters";
import { armyNames, weaponNames, classConfig, vehicleConfig } from '../../utils/config'

import './Player.css';

import StatsCard from "./StatsCard/StatsCard";
import StatsCardAwards from "./StatsCard/StatsCardAwards";
import AwardsBlock from "./AwardBlock/AwardsBlock";
import PlayerHero from "./PlayerHero/PlayerHero";
import UnlocksBlock from "./UnlocksBlock/UnlocksBlock";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setLoading, setPlayerData } from '../../store/playerSlice';
import Loader from "../../components/Loader";
import ErrorCard from "../../components/ErrorCard";

const Player: React.FC = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state: RootState) => state.player);

    const { pid } = useParams<{ pid: string }>();
    const [searchParams] = useSearchParams();
    const project = (searchParams.get('project') || 'bf2hub') as any;

    useEffect(() => {
        const loadStats = async () => {
            dispatch(setLoading(true));
            try {
                const result: any = await getPlayer(pid!, project);
                const resultAwards = await getPlayerAwards(pid!, project)
                const resultUnlock = await getPlayerUnlocks(pid!, project)
                const resultLive = await getPlayerServer(result.data.nick);
                dispatch(setPlayerData({
                    data: result,
                    awards: resultAwards,
                    unlocks: resultUnlock,
                    live: resultLive
                }));
            } catch (e) {
                return <ErrorCard msg={"Помилка:" + e + "."}/>
            } finally {
                dispatch(setLoading(false));
            }
        };
        loadStats();
    }, [pid, project, dispatch]);

    if (loading) return <Loader/>;
    if (!data) return <ErrorCard msg="Гравця не знайдено"/>;

    const player  = data.data;

    const kills = safeNum(player.kills.total);
    const deaths = safeNum(player.deaths.total);

    const generalStats = [
        { label: 'Загальні очки:', value: player.score.total },
        { label: 'Очки за бій:', value: player.score.combat },
        { label: 'Командні очки:', value: player.score.teamwork },
        { label: 'Очки командира:', value: player.score.commander },
        { label: 'Раундів:', value: player.rounds.conquest + player.rounds.supply_lines + player.rounds.coop },
        { label: 'Перемог:', value: player.rounds.wins },
        { label: 'Поразок:', value: player.rounds.losses },
    ];

    const teamWorkStats = [
        { label: 'Прапорів захоплено:', value: player.teamwork.flag_captures },
        { label: 'Допомог в захоплені:', value: player.teamwork.flag_assists },
        { label: 'Захистів прапора:', value: player.teamwork.flag_defends },
        { label: 'Допомог у вбивстві:', value: player.teamwork.kill_assists},
        { label: 'Лікувань:', value: player.teamwork.heals},
        { label: 'Реанімацій:', value: player.teamwork.revives},
        { label: 'Ремонт:', value: player.teamwork.repairs},
        { label: 'Поповнення боєзапасу:', value: player.teamwork.resupplies},
        { label: 'Допомог водієм:', value: player.teamwork.driver_assists},
        { label: 'Водій спеціаліст:', value: player.teamwork.driver_specials},
    ];

    const battleStats = [
        { label: 'Вбивства:', value: kills },
        { label: 'Смерті:', value: deaths },
        { label: 'Влучність:', value: Math.ceil((player.accuracy)*100)/100 + '%'},
        { label: 'У/C:', value: deaths === 0 ? kills : (kills / deaths).toFixed(2) },
        { label: 'Смертельніший опонент:', value: player.relations.top_rival.nick},
        { label: 'Найкраща жертва:', value: player.relations.top_victim.nick},
        { label: 'Серія вбивств:', value: player.kills.streak},
        { label: 'Самогубств:', value: player.deaths.suicides},
    ]

    const timeStats = [
        { label: 'Час у грі:', value: toHours(safeNum(player.time.total)) },
        { label: 'Командир', value: toHours(player.time.commander)},
        { label: 'Лідер загону', value: toHours(player.time.squad_leader)},
        { label: 'Член загону', value: toHours(player.time.squad_member)},
        { label: 'Самітник', value: toHours(player.time.lone_wolf)},
    ]

    return (
    <div>
        <div className="player-container">
            <PlayerHero project={project}/>

            <div className="stats-grid">
                <StatsCard title="Загальна статистика" stats={generalStats} />
                <StatsCard title="Командна робота" stats={teamWorkStats} />
                <StatsCard title="Боєва статистика" stats={battleStats}/>
                <StatsCard title="ЧАС" stats={timeStats}/>
            </div>
        </div>

        <div className="player-container">
            <div className="other-stats-grid">
                <div className="stats-card">
                    <h3>Статистика за армії</h3>
                    {player?.armies?.filter((a: any) => safeNum(a.time) > 0).map((army: any) => {
                        const aTime = safeNum(army.time);
                        const aWins = safeNum(army.wins);
                        const aLoss = safeNum(army.losses);

                        return (
                            <div className="other-item" key={army.id}>
                                <div className="other-header">
                                    <span>
                                        {armyNames[army.id]}
                                    </span>
                                    <b>{toHours(aTime)}</b>
                                </div>

                                <div className="other-stats-row">
                                    <span>Перемог: <b>{aWins}</b></span>
                                    <span>Поразок: <b>{aLoss}</b></span>
                                    <span>W/L: <b>
                                        {aLoss === 0 ? aWins : (aWins / aLoss).toFixed(2)}
                                    </b></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="stats-card">
                    <h3>Статистика зброї</h3>
                    {player?.weapons?.filter((w: any) => safeNum(w.time) > 0).map((weapon: any) => {
                        const wTime = safeNum(weapon.time);
                        const wKills = safeNum(weapon.kills);
                        const wDeaths = safeNum(weapon.deaths);
                        const wAccuracy = parseFloat(weapon.accuracy || 0).toFixed(2);
                        const wKD = safeNum(weapon.kd)

                        return (
                            <div className="other-item" key={weapon.id}>
                                <div className="other-header">
                                    <span>
                                        {weaponNames[weapon.id]}
                                    </span>
                                    <b>{toHours(wTime)}</b>

                                </div>

                                <div className="other-stats-row">
                                    <span>Вбивств: <b>{wKills}</b></span>
                                    <span>Смертей: <b>{wDeaths}</b></span>
                                    <span>Влучність: <b>{wAccuracy}%</b></span>
                                    <span>У/С: <b>{wKD}</b></span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <StatsCardAwards title="Статистика техніки" config={vehicleConfig}/>
                <StatsCardAwards title="Статистика класів" config={classConfig}/>
            </div>
            <UnlocksBlock/>
            <AwardsBlock/>
        </div>
    </div>
    );
};

export default Player;