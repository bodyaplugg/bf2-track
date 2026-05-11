import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404 - Сторінку не знайдено</h1>
            <p>Вибачте, але такої сторінки не існує.</p>
            <Link to="/">Повернутися на головну</Link>
        </div>
    );
};

export default NotFound;