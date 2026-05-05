import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const nav = useNavigate();
    const navigate = () => {
        nav("pages/saved-countries");
    }
    const navigateHome = () => {
        nav("pages/home");
    }

    return (
        <div className="navbar">
            <h1 onClick={navigateHome}>Where In The World?</h1>
            <p onClick={navigate}>
                Saved Countries
            </p>
        </div>
    );
}

export default Header;