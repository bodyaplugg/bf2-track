import React, { useState, useEffect } from 'react';

interface FavoriteProps {
    serverIp: string;
}

const FavoriteButton: React.FC<FavoriteProps> = ({ serverIp }) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favoriteServers') || '[]');
        setIsFavorite(favorites.includes(serverIp));
    }, [serverIp]);

    const toggleFavorite = () => {
        const favorites: string[] = JSON.parse(localStorage.getItem('favoriteServers') || '[]');

        let updatedFavorites;
        if (favorites.includes(serverIp)) {
            updatedFavorites = favorites.filter(ip => ip !== serverIp);
            setIsFavorite(false);
        } else {
            updatedFavorites = [...favorites, serverIp];
            setIsFavorite(true);
        }

        localStorage.setItem('favoriteServers', JSON.stringify(updatedFavorites));
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
            title={isFavorite ? "Видалити з вибраного" : "Додати у вибране"}
        >
            <span className="star-icon">{isFavorite ? '★' : '☆'}</span>
            {isFavorite ? ' У ВИБРАНОМУ' : ' У ВИБРАНЕ'}
        </button>
    );
};

export default FavoriteButton;