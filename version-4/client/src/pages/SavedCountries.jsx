import { useState, useEffect, lazy, Suspense } from "react";
import ProfileForm from "../components/ProfileForm";
import Loading from "../components/Loading";
import "./SavedCountries.css";

// mapbox is a big library and this is the only page that uses it, so it's only fetched when this page
// opens. otherwise the home and detail pages would download it too, for a map they never show
const WorldMap = lazy(() => import("../components/WorldMap"));

// saved page: the countries you've hearted shown as pins on the map, plus the profile form. the database only stores names, so this page matches those names against the full list from App to get the flags and the rest of the info
function SavedCountries({ countries, isDarkMode }) {
    const [savedCountries, setSavedCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    // pull saved country names from the DB, then filter the full country list down to those. countries is in the dependency array because App's fetch finishes after this page loads, and without it the list would stay empty on a refresh
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
                    savedNames.includes(country.name)
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
                // the fallback holds the same height the map will take, so the profile form below doesn't
                // jump up the page while the map is still being fetched
                <Suspense fallback={<div className="mapPlaceholder" />}>
                    {/* onUnsave takes the country off this list, which drops its pin straight away instead
                        of waiting on another fetch */}
                    <WorldMap
                        countries={savedCountries}
                        isDarkMode={isDarkMode}
                        onUnsave={(name) =>
                            setSavedCountries((prev) => prev.filter((c) => c.name !== name))
                        }
                    />
                </Suspense>
            )}

            <ProfileForm />
        </div>
    );
}

export default SavedCountries;
