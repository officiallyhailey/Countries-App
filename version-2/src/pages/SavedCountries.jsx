import { useState, useEffect } from "react";
import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import "/src/index.css";

function SavedCountries({ countries }) {
    const [savedCountries, setSavedCountries] = useState([]);

    // When the component mounts or the list of all countries changes, fetch the list of saved countries from the server. Then filter the full list of countries to only include those that are saved, and update the state with this filtered list. This ensures that we have the most up-to-date information on which countries are saved, and allows us to display their details properly.
    useEffect(() => {
        const fetchSavedCountries = async () => {
            try {
                const response = await fetch("https://backend-answer-keys.onrender.com/get-all-saved-countries");
                const data = await response.json();
                const savedNames = data.map((item) =>
                    typeof item === "string" ? item : item.country_name
                );
                const filtered = countries.filter((country) =>
                    savedNames.includes(country.name.common)
                );
                setSavedCountries(filtered);
            } catch (error) {
                console.error("Failed to fetch saved countries:", error);
            }
        };
        fetchSavedCountries();
    }, [countries]);

    return (
     
        <div className="saved-countries" style={{color: "var(--text-primary)"}}>

            <h1>My Saved Countries</h1>

            {savedCountries.length === 0 ? (
                <p className="empty-message">
                    No saved countries yet. Open a country and click ♡ Save to add it here!
                </p>
            ) : (
                <CountryCard
                    countries={savedCountries}
                    onUnsave={(name) =>
                        setSavedCountries((prev) => prev.filter((c) => c.name.common !== name))
                    }
                />
            )}

            <ProfileForm />

        </div>
    );
}

export default SavedCountries;
