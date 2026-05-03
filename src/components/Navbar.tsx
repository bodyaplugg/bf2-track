import React, { useState, useRef, useEffect } from 'react';
import {stats, Project} from "../utils/stats/stats";
import './Navbar.css';

interface PlayerPreview {
    id: string;
    nickname: string;
    rank: number;
    isOnline: boolean;
}

interface NavbarProps {
    onSearch: (nickname: string, project: Project) => void;
}

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
    const [nickname, setNickname] = useState('');
    const [project, setProject] = useState<Project>('bf2hub');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<PlayerPreview[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedNickname = useDebounce(nickname, 300);

    const projects: Project[] = ['bf2hub', 'playbf2'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) {
            onSearch(nickname, project);
            setShowResults(false);
        }
    };

    useEffect(() => {
        if (!debouncedNickname || debouncedNickname.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const fetchPlayers = async () => {
            setIsSearching(true);
            try {
                const response = await stats.search(debouncedNickname, project);

                const formattedResults: PlayerPreview[] = (response?.players || []).map((p: any) => ({
                    id: p.pid,
                    nickname: p.nick,
                    isOnline: false
                }));

                setSearchResults(formattedResults);
                setShowResults(true);
            } catch (error) {
                console.error("Search error:", error);
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
                    <a href="/">
                        <span className="logo-main">BF2</span>
                        <span className="logo-sub">-TRACK</span>
                    </a>
                </div>

                <form className="navbar-search-form" onSubmit={handleSubmit}>
                    <div className="search-composite-group" ref={searchRef}>
                        <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                            <div className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {project}
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
                                            {proj}
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
                                {searchResults && searchResults.length > 0 ? (
                                    searchResults.slice(0,8).map(player => (
                                        <div
                                            key={player.id}
                                            className="live-result-item"
                                            onClick={() => {
                                                setNickname(player.nickname);
                                                onSearch(player.nickname, project);
                                                setShowResults(false);
                                            }}
                                        >
                                            <span className="res-nick">{player.nickname}</span>
                                            <span className={`res-status ${player.isOnline ? 'online' : 'offline'}`}></span>
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
        </nav>
    );
};

export default Navbar;