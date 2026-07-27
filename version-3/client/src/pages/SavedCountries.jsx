import { useState, useEffect } from "react";
import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import Loading from "../components/Loading";
import "./SavedCountries.css";

// saved page: the countries you've hearted, plus the profile form. the database only stores names, so this page matches those names against the full list from App to get the flags and the rest of the info
function SavedCountries({ countries }) {
    const [savedCountries, setSavedCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    // pull saved country names from the DB, then filter the full country list down to those. countries is in the dependency array because App's fetch finishes after this page loads, and without it the list would stay empty on a refresh
    useEffect(() => {
        const fetchSavedCountries = async () => {
            try {
                const response = await fetch("/api/get-all-saved-countries");
                const data = await response.json();
                // server may return strings or { country_name } objects
                const savedNames = data.map((item) =>
                    typeof item === "string" ? item : item.country_name
                );
                const filtered = countries.filter((country) =>
                    savedNames.includes(country.name.common)
                );
                setSavedCountries(filtered);
            } catch (error) {
                console.error("Failed to fetch saved countries:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedCountries();
    }, [countries]);

    if (loading) return <Loading />;

    return (
        <div className="saved-countries">
            <h1>My Saved Countries</h1>

            {savedCountries.length === 0 ? (
                <p className="empty-message">
                    No saved countries yet. Open a country and click ♡ Save to add it here!
                </p>
            ) : (
                // onUnsave takes the card off this list straight away, so unhearting something makes it disappear without needing to fetch again
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
