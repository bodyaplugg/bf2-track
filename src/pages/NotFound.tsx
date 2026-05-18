import { Link } from 'react-router-dom';
import {useEffect} from "react";

const NotFound = () => {
    useEffect(() => {
        document.title = `BF2-track | Сторінка не знайдена`
    })
    return (
        <div className="not-found">
            <h1>404 - Сторінку не знайдено</h1>
            <p>Вибачте, але такої сторінки не існує.</p>
            <Link to="/">Повернутися на головну</Link>
        </div>
    );
};

export default NotFound;