import { useNavigate } from "react-router-dom";
import "./CountryCard.css";

// renders a grid of country cards, sorted alphabetically by name
function CountryCard({ countries }) {
    const navigate = useNavigate();
    const sortedCountries = [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common));

    return (
        <div className="countryCard">
            {sortedCountries.map((country) => (
                <div
                    key={country.name.common}
                    className="card"
                    onClick={() => navigate(`/pages/country/${encodeURIComponent(country.name.common)}`)}
                >
                    
                    <img src={country.flags.png} alt={`${country.name.common} flag`} className="flag" onError={(e) => { e.target.src = country.flags.svg; }} />
                    <div className="cardContent">
                    <h2>{country.name.common}</h2>
                    <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> {country.region}</p>
                    <p><strong>Capital:</strong> {country.capital}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CountryCard;