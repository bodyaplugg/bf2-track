import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { stats, Project } from '../../utils/stats/stats';
import './SearchResults.css';

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
        if (!nickname || !project) {
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await stats.search(nickname, project);
                const formattedResults: PlayerPreview[] = (response?.players || []).map((p: any) => ({
                    id: p.pid,
                    nickname: p.nick,
                }));
                setResults(formattedResults);
            } catch (err: any) {
                if (err.message && err.message.includes('ETIMEDOUT')) {
                    setError(`The ${project} server is not responding. Please try again later.`);
                } else {
                    setError('Failed to fetch search results.');
                }
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [nickname, project]);

    if (isLoading) {
        return <div className="p-loader">Пошук...</div>;
    }

    if (error) {
        return <div className="p-error">Помилка: {error}</div>;
    }

    return (
        <div className="search-results-container">
            <h2>Search Results for "{nickname}"</h2>
            {results.length > 0 ? (
                <div className="results-list">
                    {results.map(player => (
                        <Link to={`/player/${player.id}?project=${project}`} key={player.id} className="result-item">
                            <span className="result-nick">{player.nickname}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="no-results">No players found.</div>
            )}
        </div>
    );
};

export default SearchResults;
