import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DetailCard.css";
import SaveCountryBtn from "./SaveCountryBtn";

// the single country page: flag, stats, how many times it's been searched, border links and the heart button. both useEffects below watch the country name instead of just running once, because clicking a border button changes the country without reloading this component
function DetailCard({ country, allCountries }) {
    const navigate = useNavigate();
    const [searchCount, setSearchCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    // bumps the view count in the DB every time this page loads. the server sends the new count back in its response, so one request both records the visit and gives me the number to show
    useEffect(() => {
        async function updateCount() {
            try {
                const response = await fetch("/api/update-one-country-count", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ country_name: country.name }),
                });
                const data = await response.json();
                setSearchCount(data.count);
            } catch (error) {
                console.error("Failed to update country count:", error);
            }
        }
        updateCount();
    }, [country.name]);

    // on the cards page the grid checks which countries are saved, but there's no grid here, so this page has to ask the server itself and pass the answer to the heart button
    useEffect(() => {
        async function checkSavedStatus() {
            try {
                const response = await fetch("/api/get-all-saved-countries");
                const data = await response.json();
                const savedNames = data.map((item) =>
                    typeof item === "string" ? item : item.country_name
                );
                setIsSaved(savedNames.includes(country.name));
            } catch (error) {
                console.error("Failed to check saved status:", error);
            }
        }
        checkSavedStatus();
    }, [country.name]);

    // the API gives borders as three letter codes like "FRA", so each one gets looked up in the full list to find the country and its real name. the || [] is for islands that have no borders at all, filter(Boolean) removes any codes that didn't match anything, and slice keeps it to three buttons so the row doesn't wrap
    const borderCountries = (country.borders || [])
        .map((code) => allCountries.find((c) => c.alpha3Code === code))
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="DetailCard">
            {/* -1 means go back one page in history instead of to a set route, so you land back on whatever search or filter you had */}
            <button className="backBtn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="detailContainer">
                <div className="detailLeft">
                    <img
                        src={country.flags.png}
                        alt={`${country.name} flag`}
                        className="detailFlag"
                        onError={(event) => {
                            event.target.src = country.flags.svg;
                        }}
                    />
                </div>

                <div className="detailRight">
                    <h2>{country.name}</h2>

                    <div className="detailContent">
                        <div className="details">
                            <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                            <p><strong>Region:</strong> {country.region}</p>
                            <p><strong>Capital:</strong> {country.capital}</p>
                            <p><strong>Searched:</strong> {searchCount} {searchCount === 1 ? "time" : "times"}</p>
                        </div>
                    </div>

                    {/* hides the whole section for countries with no borders, so there's no empty heading sitting there */}
                    {borderCountries.length > 0 && (
                        <div className="borderCountries">
                            <strong>Border Countries:</strong>
                            <div className="borderBtns">
                                {borderCountries.map((bc) => (
                                    <button
                                        key={bc.alpha3Code}
                                        className="borderBtn"
                                        onClick={() => navigate(`/pages/country/${encodeURIComponent(bc.name)}`)}
                                    >
                                        {bc.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <SaveCountryBtn country={country} isSaved={isSaved} />
                </div>
            </div>
        </div>
    );
}

export default DetailCard;
