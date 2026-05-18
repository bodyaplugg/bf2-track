import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchPlayers, Project } from '../../service/stats';
import './SearchResults.css';
import Loader from "../../components/Loader";
import ErrorCard from "../../components/ErrorCard";

interface PlayerPreview {
    id: string;
    nickname: string;
}

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState<PlayerPreview[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nickname = searchParams.get('nickname');
    const project = searchParams.get('project') as Project | null;

    useEffect(() => {
        document.title = `BF2-track | Результати пошуку для "${nickname}"`
    }, []);

    useEffect(() => {
        if (!nickname || !project) {
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response: any = await searchPlayers(nickname, project);
                const formattedResults: PlayerPreview[] = (response?.results || []).map((p: any) => ({
                    id: p.pid,
                    nickname: p.nick,
                }));
                setResults(formattedResults);
            } catch (err: any) {
                if (err.message && err.message.includes('ETIMEDOUT')) {
                    setError(`Сервер ${project} не відповідає. Спробуйте пізніше.`);
                } else {
                    setError('Не вдалося здійснити пошук.');
                }
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [nickname, project]);

    if (isLoading) {
        return <Loader/>;
    }

    if (error) {
        return <ErrorCard msg={'Помилка: ' + error}/>;
    }

    return (
        <div className="search-results-container">
            <h2>Результати пошуку для: "{nickname}"</h2>
            {results.length > 0 ? (
                <div className="results-list">
                    {results.map(player => (
                        <Link to={`/player/${player.id}?project=${project}`} key={player.id} className="result-item">
                            <span className="result-nick">{player.nickname}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="no-results">Не знайдено гравців.</div>
            )}
        </div>
    );
};

export default SearchResults;
