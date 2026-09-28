import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getRisingLeaderboard, getScoreLeaderboard, Project } from '../../service/stats';
import ErrorCard from '../../components/ErrorCard';
import Loader from '../../components/Loader';
import './Leaderboard.css';

type ScoreCategory = 'overall' | 'commander' | 'team' | 'combat';
type LeaderboardKind = 'score' | 'rising';

interface LeaderboardPlayer {
    n: number;
    pid: number;
    nick: string;
    rank: number;
    country_code: string;
}

interface LeaderboardResponse {
    size: number;
    entries: LeaderboardPlayer[];
}

const PAGE_SIZE = 20;
const projects: Project[] = ['bf2hub', 'playbf2', 'b2bf2'];
const scoreCategories: { id: ScoreCategory; label: string }[] = [
    { id: 'overall', label: 'Загальний рахунок' },
    { id: 'commander', label: 'Очки командира' },
    { id: 'team', label: 'Командні очки' },
    { id: 'combat', label: 'Бойові очки' },
];

const isProject = (value: string | null): value is Project =>
    value !== null && projects.includes(value as Project);

const isScoreCategory = (value: string | null): value is ScoreCategory =>
    scoreCategories.some(category => category.id === value);

const toLeaderboardResponse = (value: unknown): LeaderboardResponse | null => {
    if (!value || typeof value !== 'object') return null;

    const response = value as Partial<LeaderboardResponse>;
    if (typeof response.size !== 'number' || !Array.isArray(response.entries)) return null;

    return response as LeaderboardResponse;
};

const Leaderboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const project = isProject(searchParams.get('project')) ? searchParams.get('project') as Project : 'bf2hub';
    const kind: LeaderboardKind = searchParams.get('type') === 'rising' ? 'rising' : 'score';
    const category = isScoreCategory(searchParams.get('category')) ? searchParams.get('category') as ScoreCategory : 'overall';
    const pageParam = Number(searchParams.get('page'));
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const pid = searchParams.get('pid');

    const [entries, setEntries] = useState<LeaderboardPlayer[]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'BF2-track | Таблиця лідерів';
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadLeaderboard = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let targetPage = page;

                if (pid && !searchParams.has('page') && kind === 'score') {
                    const located = toLeaderboardResponse(
                        await getScoreLeaderboard(category, project, { pid, before: 0, after: 0 })
                    );
                    const playerPosition = located?.entries[0]?.n;
                    if (playerPosition) {
                        targetPage = Math.floor((playerPosition - 1) / PAGE_SIZE) + 1;
                        const nextParams = new URLSearchParams(searchParams);
                        nextParams.set('page', String(targetPage));
                        setSearchParams(nextParams, { replace: true });
                        return;
                    }
                }

                const response = toLeaderboardResponse(
                    kind === 'rising'
                        ? await getRisingLeaderboard(project, {
                            position: (targetPage - 1) * PAGE_SIZE + 1,
                            before: 0,
                            after: PAGE_SIZE - 1,
                        })
                        : await getScoreLeaderboard(category, project, {
                            position: (targetPage - 1) * PAGE_SIZE + 1,
                            before: 0,
                            after: PAGE_SIZE - 1,
                        })
                );

                if (!response) {
                    throw new Error('Таблиця лідерів не повернула дані.');
                }

                if (!cancelled) {
                    setEntries(response.entries);
                    setTotalSize(response.size);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : String(loadError));
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadLeaderboard();
        return () => {
            cancelled = true;
        };
    }, [category, kind, page, pid, project, searchParams, setSearchParams]);

    const updateFilters = (updates: Record<string, string>) => {
        const nextParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => nextParams.set(key, value));
        nextParams.delete('page');
        nextParams.delete('pid');
        setSearchParams(nextParams);
    };

    const pageCount = Math.max(1, Math.ceil(totalSize / PAGE_SIZE));
    const goToPage = (nextPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(nextPage));
        nextParams.delete('pid');
        setSearchParams(nextParams);
    };

    return (
        <main className="leaderboard-page">
            <header className="leaderboard-page-header">
                <p className="leaderboard-eyebrow">BF2-TRACK / РЕЙТИНГИ</p>
                <h1>Таблиця лідерів</h1>
                <p>Переглядайте рейтинги гравців за проєктом і типом очок.</p>
            </header>

            <section className="leaderboard-panel" aria-label="Таблиця лідерів">
                <div className="leaderboard-filters">
                    <label>
                        <span>Проєкт</span>
                        <select value={project} onChange={event => updateFilters({ project: event.target.value })}>
                            <option value="bf2hub">BF2Hub</option>
                            <option value="playbf2">PlayBF2</option>
                            <option value="b2bf2">B2BF2</option>
                        </select>
                    </label>
                    <label>
                        <span>Рейтинг</span>
                        <select value={kind} onChange={event => updateFilters({ type: event.target.value })}>
                            <option value="score">За очками</option>
                            <option value="rising">Нові зірки</option>
                        </select>
                    </label>
                    {kind === 'score' && (
                        <label>
                            <span>Категорія</span>
                            <select value={category} onChange={event => updateFilters({ category: event.target.value })}>
                                {scoreCategories.map(item => (
                                    <option key={item.id} value={item.id}>{item.label}</option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>

                {isLoading ? <Loader /> : error ? <ErrorCard msg={`Не вдалося завантажити рейтинг: ${error}`} /> : (
                    <>
                        <div className="leaderboard-table-wrap">
                            <table className="leaderboard-table full-leaderboard-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Місце</th>
                                        <th scope="col">Ранг</th>
                                        <th scope="col">Гравець</th>
                                        <th scope="col">Країна</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map(player => (
                                        <tr key={player.pid} className={pid === String(player.pid) ? 'current-player' : undefined}>
                                            <td className="leaderboard-position">#{player.n.toLocaleString()}</td>
                                            <td>
                                                <img
                                                    src={`/assets/img/ranks/${player.rank}.png`}
                                                    alt={`Ранг ${player.rank}`}
                                                    className="leaderboard-rank"
                                                />
                                            </td>
                                            <td>
                                                <Link to={`/player/${player.pid}?project=${project}`} className="leaderboard-player-link">
                                                    {player.nick}
                                                </Link>
                                            </td>
                                            <td className="leaderboard-country">
                                                {player.country_code && (
                                                    <img
                                                        src={`https://flagsapi.com/${player.country_code}/shiny/32.png`}
                                                        alt={player.country_code}
                                                        title={player.country_code}
                                                        onError={event => { event.currentTarget.style.display = 'none'; }}
                                                    />
                                                )}
                                                <span>{player.country_code || '—'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {entries.length === 0 && (
                                        <tr><td colSpan={4} className="leaderboard-empty">Немає даних для відображення.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <nav className="leaderboard-pagination" aria-label="Сторінки таблиці лідерів">
                            <button type="button" onClick={() => goToPage(1)} disabled={page <= 1}>Перша</button>
                            <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>Назад</button>
                            <span>Сторінка {page.toLocaleString()} із {pageCount.toLocaleString()}</span>
                            <button type="button" onClick={() => goToPage(page + 1)} disabled={page >= pageCount}>Далі</button>
                            <button type="button" onClick={() => goToPage(pageCount)} disabled={page >= pageCount}>Остання</button>
                        </nav>
                    </>
                )}
            </section>
        </main>
    );
};

export default Leaderboard;
