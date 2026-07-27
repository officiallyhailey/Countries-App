import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CountryCard.css";
import SaveCountryBtn from "./SaveCountryBtn";

// renders a grid of country cards, sorted alphabetically by name. used on both the home page and the saved page, the only difference is which list gets passed in
function CountryCard({ countries, onUnsave }) {
    const navigate = useNavigate();
    // using a Set instead of an array because every card checks if it's in here, and .has() is quicker than searching through an array each time
    const [savedNames, setSavedNames] = useState(new Set());

    // one fetch for the whole grid, instead of every card checking on its own. the empty [] means it only runs once when the grid loads, so searching and filtering don't keep hitting the server
    useEffect(() => {
        const fetchSavedNames = async () => {
            try {
                const response = await fetch("/api/get-all-saved-countries");
                const data = await response.json();
                const names = data.map((item) =>
                    typeof item === "string" ? item : item.country_name
                );
                setSavedNames(new Set(names));
            } catch (error) {
                console.error("Failed to check saved countries:", error);
            }
        };
        fetchSavedNames();
    }, []);

    // spreading into a new array first because sort changes the original, and countries belongs to App. localeCompare sorts accented names like Åland properly, which a normal > comparison doesn't
    const sortedCountries = [...countries].sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
    );

    return (
        <div className="countryCard">
            {sortedCountries.map((country) => (
                // the whole card is clickable to open the country, which is why the heart button inside it has to stop its own click spreading up to here (see SaveCountryBtn)
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
                    <SaveCountryBtn
                        country={country}
                        isSaved={savedNames.has(country.name.common)}
                        onUnsave={onUnsave}
                    />
                </div>
            ))}
        </div>
    );
}

export default CountryCard;
