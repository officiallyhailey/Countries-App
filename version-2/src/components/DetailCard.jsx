import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DetailCard.css";
import SaveCountry from "./SaveCountryBtn";

function DetailCard({ country, allCountries }) {
    const navigate = useNavigate();
    const [searchCount, setSearchCount] = useState(0);

    useEffect(() => {
        async function updateCount() {
            try {
                const response = await fetch("/api/update-one-country-count", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ country_name: country.name.common }),
                });
                const data = await response.json();
                console.log("API response:", data);
                setSearchCount(data.count);
            } catch (error) {
                console.error("Failed to update country count:", error);
            }
        }
        updateCount();
    }, [country.name.common]);


    const borderCountries = (country.borders || [])
        // Map border country codes to their full country objects, filter out any that aren't found, and limit to 3 for display
        .map((cca3) => allCountries.find((c) => c.cca3 === cca3))
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="detailCard">
            {/* Back button to return to the previous page */}
            <button className="backBtn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="detailContainer">
                <div className="detailLeft">
                    <img 
                    src={country.flags.png} 
                    alt={`${country.name.common} flag`} 
                    className="detailFlag" 
                    onError={(event) => { 
                        event.target.src = country.flags.svg; 
                        }}
                        />
                </div>

                <div className="detailRight">
                    <h2>{country.name.common}</h2>

                    <div className="detailContent">
                        <div className="details">
                            <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                            <p><strong>Region:</strong> {country.region}</p>
                            <p><strong>Capital:</strong> {country.capital}</p>
                            {/* // Display the search count for this country, with proper pluralization */}
                            <p><strong>Searched:</strong> {searchCount} {searchCount === 1 ? "time" : "times"}</p>
                        </div>
                    </div>

                    {borderCountries.length > 0 && (
                        <div className="borderCountries">
                            <strong>Border Countries:</strong>
                            <div className="borderBtns">
                                {borderCountries.map((bc) => (
                                    <button
                                        key={bc.cca3}
                                        className="borderBtn"
                                        onClick={() => navigate(`/pages/country/${encodeURIComponent(bc.name.common)}`)}
                                    >
                                        {bc.name.common}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                <SaveCountry country={country} />
                </div>
            </div>
        </div>
    );
}

export default DetailCard;
