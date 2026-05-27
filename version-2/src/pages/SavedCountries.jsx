import { useState, useEffect } from "react";
import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import Loading from "../components/Loading";
import "/src/index.css";

function SavedCountries({ countries }) {
    const [savedCountries, setSavedCountries] = useState([]);
    const [loading, setLoading] = useState(true);

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

                // finally is used to ensure that the loading state is set to false regardless of whether the fetch request succeeds or fails. This prevents the loading spinner from being stuck indefinitely in case of an error, allowing the user to see the error message and any available content instead.
            } finally {
                setLoading(false);
            }
        };
        fetchSavedCountries();
    }, [countries]);

    // If the data is still being fetched from the server, display a loading spinner to indicate that the content is on its way. This provides feedback to the user and improves the overall user experience by preventing confusion or frustration while waiting for the data to load.
    if (loading) return <Loading />;

    return (

        <div className="saved-countries" style={{ color: "var(--text-primary)" }}>

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
