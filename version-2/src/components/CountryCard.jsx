import { useNavigate } from "react-router-dom";
import "./CountryCard.css";
import SaveCountry from "./SaveCountryBtn";

// The CountryCard component takes  a list of countries as a prop and renders a card for each country, displaying its flag (via the png or the svg if that fails), name, population, region, and capital. The countries are sorted alphabetically by name before rendering.

function CountryCard({ countries }) {
    const navigate = useNavigate();
    const sortedCountries = [...countries].sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
    );

    return (
        <div className="countryCard">
            {sortedCountries.map((country) => (
                <div
                    className="card"
                    key={country.name.common}
                    onClick={() => {
                        const countKey = `searchCount_${country.name.common}`;
                        const current = parseInt(localStorage.getItem(countKey) || "0", 10);
                        localStorage.setItem(countKey, String(current + 1));
                    }}
                >
                    <img
                        src={country.flags.png}
                        alt={`${country.name.common} flag`}
                        className="flag"
                        onError={(event) => {
                            event.target.src = country.flags.svg;
                        }}
                        onClick={() => {navigate(
                            `/pages/country/${encodeURIComponent(country.name.common)}`);}}
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
                        <SaveCountry country={country} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CountryCard;
