import React  from 'react';
import {Link} from "react-router-dom";
import './LinkButton.css'

interface LinkProps {
    title: string;
    to: string;
}

const LinkButton: React.FC<LinkProps> = ({ title, to }) => {
    return (
        <Link className="link-btn" to={to} target="_blank">
            {title}
        </Link>
    );
};

export default LinkButton;