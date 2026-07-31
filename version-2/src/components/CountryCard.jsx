import { useNavigate } from "react-router-dom";
import "./CountryCard.css";
import SaveCountry from "./SaveCountryBtn";

// renders a grid of country cards, sorted alphabetically by name. used on both the home page and the saved page, the only difference is which list gets passed in
function CountryCard({ countries }) {
    const navigate = useNavigate();
    // spreading into a new array first because sort changes the original, and countries belongs to App. localeCompare sorts accented names like Åland properly, which a normal > comparison doesn't
    const sortedCountries = [...countries].sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
    );

    return (
        <div className="countryCard">
            {sortedCountries.map((country) => (
                <div
                    className="card"
                    key={country.name.common}
                    onClick={() => navigate(`/pages/country/${encodeURIComponent(country.name.common)}`)}
                >
                    <img
                        src={country.flags.png}
                        alt={`${country.name.common} flag`}
                        className="flag"
                        // some of the PNG flags don't load, so swap in the SVG instead of showing a broken image
                        onError={(event) => {
                            event.target.src = country.flags.svg;
                        }}
                    />
                    <div className="cardContent">
                        <h2>{country.name.common}</h2>
                        <p>
                            <strong>Population:</strong> {country.population.toLocaleString()}
                        </p>
                        <p>
                            <strong>Region:</strong> {country.region}
                        </p>
                        <p>
                            <strong>Capital:</strong> {country.capital}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CountryCard;
