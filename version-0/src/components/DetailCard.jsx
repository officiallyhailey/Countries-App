import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DetailCard.css";

function DetailCard({ country, allCountries }) {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [searchCount, setSearchCount] = useState(0);


    useEffect(() => {
        // Check if the country is saved in localStorage
        const savedKey = "savedCountries";
        const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
        setIsSaved(saved.includes(country.name.common));

        // Track search count for this country
        const countKey = `searchCount_${country.name.common}`;
        const current = parseInt(localStorage.getItem(countKey) || "0", 10);
        const updated = current + 1;
        localStorage.setItem(countKey, updated);
        setSearchCount(updated);
    }, [country.name.common]);

    // the same button saves and unsaves, it just checks isSaved to work out which one to do
    const handleSave = () => {
        const key = "savedCountries";
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = isSaved
            ? saved.filter((c) => c !== country.name.common)
            : [...saved, country.name.common];
        localStorage.setItem(key, JSON.stringify(updated));
        setIsSaved(!isSaved);
    };

    // borders come through as three letter codes like "FRA", so each one gets looked up in the full list to find its real name. the || [] is for islands with no borders, and slice keeps it to three buttons so the row doesn't wrap
    const borderCountries = (country.borders || [])
        .map((cca3) => allCountries.find((c) => c.cca3 === cca3))
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="detailCard">
            <button className="backBtn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="detailContainer">
                <div className="detailLeft">
                    <img src={country.flags.png} alt={`${country.name.common} flag`} className="detailFlag" onError={(e) => { e.target.src = country.flags.svg; }} />
                </div>

                <div className="detailRight">
                    <h2>{country.name.common}</h2>

                    <div className="infoGrid">
                        <div className="infoCol">
                            <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                            <p><strong>Region:</strong> {country.region}</p>
                            <p><strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}</p>
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

                    <button
                        className={`saveBtn${isSaved ? " saved" : ""}`}
                        onClick={handleSave}
                    >
                        {isSaved ? "♥ Saved" : "♡ Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailCard;
