import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

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
                    {theme === 'light' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
                </button>
            </div>
        </div>
    );
}

export default Header;
