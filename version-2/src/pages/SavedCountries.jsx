import { useState, useEffect } from "react";
import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import Loading from "../components/Loading";
import "/src/index.css";

// saved page: the countries you've hearted, plus the profile form. the server only stores names, so this page matches those names against the full list from App to get the flags and the rest of the info
function SavedCountries({ countries }) {
    const [savedCountries, setSavedCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    // countries is in the dependency array because App's fetch finishes after this page loads, and without it the list would stay empty on a refresh
    useEffect(() => {
        const fetchSavedCountries = async () => {
            try {
                const response = await fetch("/api/get-all-saved-countries");
                const data = await response.json();
                // each row comes back as a { country_name } object, so this pulls the plain name out of every one to compare against the country list
                const savedNames = data.map((item) =>
                    typeof item === "string" ? item : item.country_name
                );
                const filtered = countries.filter((country) =>
                    savedNames.includes(country.name.common)
                );
                setSavedCountries(filtered);
            } catch (error) {
                console.error("Failed to fetch saved countries:", error);
                // finally runs whether the fetch worked or not, so a failed request can't leave the loading screen up forever
            } finally {
                setLoading(false);
            }
        };
        fetchSavedCountries();
    }, [countries]);

    if (loading) return <Loading />;

    return (

        <div className="saved-countries" style={{ color: "var(--text-primary)" }}>

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
