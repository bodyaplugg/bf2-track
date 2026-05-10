import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { stats } from '../../utils/stats/stats';
import { getPlayerServer } from "../../utils/live";
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
                const result = await stats.getPlayer(pid!, project);
                const resultAwards = await stats.getAwards(pid!, project)
                const resultUnlock = await stats.getUnlocks(pid!, project)
                const resultLive = await getPlayerServer(result.player.nick);
                dispatch(setPlayerData({ data: result, awards: resultAwards, unlocks: resultUnlock, live: resultLive }));
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

    const { player, grouped } = data;

    const kills = safeNum(player.kill);
    const deaths = safeNum(player.deth);
    const score = safeNum(player.scor);

    const generalStats = [
        { label: 'Загальні очки:', value: score },
        { label: 'Очки за бій:', value: (score - safeNum(player.twsc) - safeNum(player.cdsc)).toLocaleString() },
        { label: 'Командні очки:', value: player.twsc },
        { label: 'Очки командира:', value: player.cdsc },
        { label: 'Раундів:', value: player.mode0 + player.mode1 + player.mode2 },
        { label: 'Перемог:', value: player.wins },
        { label: 'Поразок:', value: player.loss },
    ];

    const teamWorkStats = [
        { label: 'Прапорів захоплено:', value: player.cpcp },
        { label: 'Допомог в захоплені:', value: player.cacp },
        { label: 'Захистів прапора:', value: player.dfcp },
        { label: 'Допомог у вбивстві:', value: player.kila},
        { label: 'Лікувань:', value: player.heal},
        { label: 'Реанімацій:', value: player.rviv},
        { label: 'Ремонт:', value: player.rsup},
        { label: 'Поповнення боєзапасу:', value: player.rpar},
        { label: 'Допомог водієм:', value: player.dsab},
    ];

    const battleStats = [
        { label: 'Вбивства:', value: kills },
        { label: 'Смерті:', value: deaths },
        { label: 'Влучність:', value: Math.ceil((player.osaa)*100)/100 + '%'},
        { label: 'У/C:', value: deaths === 0 ? kills : (kills / deaths).toFixed(2) },
        { label: 'Смертельніший опонент:', value: player.vmns},
        { label: 'Найкраща жертва:', value: player.mvns},
        { label: 'Серія вбивств:', value: player.bksk},
        { label: 'Самогубств:', value: player.suic},
    ]

    const timeStats = [
        { label: 'Час у грі:', value: toHours(safeNum(player.time)) },
        { label: 'Командир', value: toHours(player.tcdr)},
        { label: 'Лідер загону', value: toHours(player.tsql)},
        { label: 'Член загону', value: toHours(player.tsqm)},
        { label: 'Самітник', value: toHours(player.tlwf)},
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
                    {grouped?.armies?.filter((a: any) => safeNum(a.tm) > 0).map((army: any) => {
                        const aTime = safeNum(army.tm);
                        const aWins = safeNum(army.wn);
                        const aLoss = safeNum(army.lo);

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
                    {grouped?.weapons?.filter((w: any) => safeNum(w.tm) > 0).map((weapon: any) => {
                        const wTime = safeNum(weapon.tm);
                        const wKills = safeNum(weapon.kl);
                        const wDeaths = safeNum(weapon.dt);
                        const wAccuracy = parseFloat(weapon.ac || 0).toFixed(2);

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
                                    <span>У/С: <b>
                                        {wDeaths === 0 ? wKills : (wKills / wDeaths).toFixed(2)}
                                    </b></span>
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