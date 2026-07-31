import { useNavigate } from "react-router-dom";
import "./CountryCard.css";
import SaveCountry from "./SaveCountry";

// renders a grid of country cards, sorted alphabetically by name. the png flag is swapped for the svg if it fails to load

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
                        {/* <SaveCountry country={country} /> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CountryCard;
