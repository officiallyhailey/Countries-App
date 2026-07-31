import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

// the top bar. dark mode is handled in App, this just gets the current setting and the toggle function passed in as props
function Header({ isDarkMode, toggleTheme }) {
    const nav = useNavigate();

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
                    {isDarkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
                </button>
            </div>
        </div>
    );
}

export default Header;
