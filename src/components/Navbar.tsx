import React, { useState, useRef, useEffect } from 'react';
import { stats, Project } from "../utils/stats/stats";
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

interface PlayerPreview {
    id: string;
    nickname: string;
}

interface NavbarProps {}

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const Navbar: React.FC<NavbarProps> = () => {
    const [nickname, setNickname] = useState('');
    const [project, setProject] = useState<Project>('bf2hub');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<PlayerPreview[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedNickname = useDebounce(nickname, 300);
    const navigate = useNavigate();

    const projects: Project[] = ['bf2hub', 'playbf2'];
    const projectDisplayNames: Record<Project, string> = {
        bf2hub: 'BF2Hub',
        playbf2: 'PlayBF2',
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) {
            navigate(`/search?nickname=${nickname}&project=${project}`);
            setShowResults(false);
            setIsMobileMenuOpen(false);
            setNickname('');
        }
    };

    const handlePlayerClick = (pid: string) => {
        setShowResults(false);
        setNickname('');
        setIsMobileMenuOpen(false);
        navigate(`/player/${pid}?project=${project}`);
    };

    useEffect(() => {
        if (!debouncedNickname || debouncedNickname.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            setSearchError(null);
            return;
        }

        const fetchPlayers = async () => {
            setIsSearching(true);
            setSearchError(null);
            try {
                const response = await stats.search(debouncedNickname, project);

                const formattedResults: PlayerPreview[] = (response?.players || []).map((p: any) => ({
                    id: p.pid,
                    nickname: p.nick,
                }));

                setSearchResults(formattedResults);
                setShowResults(true);
            } catch (error: any) {
                if (error.message && error.message.includes('ETIMEDOUT')) {
                    setSearchError(`Серве ${project} не відповідає.`);
                } else {
                    setSearchError('Пошук не вдався.');
                }
                console.error("Помилка:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        fetchPlayers();
    }, [debouncedNickname, project]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">
                        <span className="logo-main">BF2</span>
                        <span className="logo-sub">-TRACK</span>
                    </Link>
                </div>

                <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="navbar-links">
                        <Link to="/servers" className="navbar-link">Сервери</Link>
                    </div>
                    <div className="navbar-search">
                        <form className="navbar-search-form" onSubmit={handleSubmit}>
                            <div className="search-composite-group" ref={searchRef}>
                                <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                                    <div className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                        {projectDisplayNames[project]}
                                        <span className="arrow-icon">▼</span>
                                    </div>
                                    {isDropdownOpen && (
                                        <ul className="dropdown-menu">
                                            {projects.map((proj) => (
                                                <li
                                                    key={proj}
                                                    className={project === proj ? 'selected' : ''}
                                                    onClick={() => {
                                                        setProject(proj);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {projectDisplayNames[proj]}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Введіть нікнейм гравця..."
                                        value={nickname || ''}
                                        onChange={(e) => setNickname(e.target.value)}
                                        onFocus={() => (nickname?.length || 0) >= 3 && setShowResults(true)}
                                    />
                                    {isSearching && <div className="inline-loader"></div>}
                                </div>

                                <button type="submit" className="search-button">
                                    <span className="material-symbols-outlined">search</span>
                                </button>

                                {showResults && (nickname?.length || 0) >= 3 && (
                                    <div className="live-search-results">
                                        {searchError ? (
                                            <div className="live-no-results error">{searchError}</div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.slice(0,8).map(player => (
                                                <div
                                                    key={player.id}
                                                    className="live-result-item"
                                                    onClick={() => handlePlayerClick(player.id)}
                                                >
                                                    <span className="res-nick">{player.nickname}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="live-no-results">Нікого не знайдено</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span className="material-symbols-outlined">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;