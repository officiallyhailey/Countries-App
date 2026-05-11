import data from "/localData.js";
import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import "./SavedCountries.css";

function SavedCountries() {
    // Read the array of saved country names from localStorage
    const savedNames = JSON.parse(localStorage.getItem("savedCountries") || "[]");

    // Read saved profile to greet the user by name
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    // Filter the full country list down to only the ones the user saved
    const savedCountries = data.filter((country) =>
        savedNames.includes(country.name.common)
    );

    return (
        <div className="saved-countries">

            {/* ---- Saved Countries Section ---- */}
            <h1>My Saved Countries</h1>

            {savedCountries.length === 0 ? (
                // Show a  message when nothing has been saved yet
                <p className="empty-message">
                    No saved countries yet. Open a country and click ♡ Save to add it here!
                </p>
            ) : (
                // Reuse the same CountryCard grid from the Home page, in alphabetical order
                <CountryCard countries={savedCountries} />
            )}

            {/*  Profile Section */}
            <h2 className="profile-heading">
                {profile.name ? `Welcome back, ${profile.name}!` : "My Profile"}
            </h2>

            {/* ProfileForm handles loading and saving profile data */}
            <ProfileForm />

        </div>
    );
}

export default SavedCountries;
