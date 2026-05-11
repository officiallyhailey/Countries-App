import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

function MoonIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    );
}

function SunIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
    );
}

function Header() {
    const nav = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const navigate = () => nav("pages/saved-countries");
    const navigateHome = () => nav("pages/home");

    return (
        <div className="navbar">
            <h1 onClick={navigateHome}>Where In The World?</h1>
            <div className="navbar-right">
                <p className="saved-text" onClick={navigate}>Saved Countries</p>
                <button className="saved-icon" onClick={navigate} aria-label="Saved Countries">
                    <FontAwesomeIcon icon={faHeart} />
                </button>
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
            </div>
        </div>
    );
}

export default Header;
