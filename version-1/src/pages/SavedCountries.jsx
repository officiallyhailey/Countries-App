import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import "./SavedCountries.css";
import "/src/index.css";


// This page shows the user's saved countries, and also includes the profile form so they can save their name for a personalized greeting. It reuses the same CountryCard grid from the Home page, but filters the list of countries down to just the ones the user has saved. It also reads the user's profile from localStorage to greet them by name if they've saved it.

function SavedCountries({ countries }) {
    const allCountries = countries;

    // Read the array of saved country names from localStorage
    const savedNames = JSON.parse(localStorage.getItem("savedCountries") || "[]");

    // Read saved profile to greet the user by name
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    // Filter the full country list down to only the ones the user saved
    const savedCountries = allCountries.filter((country) =>
        savedNames.includes(country.name.common)
    );

    return (
        // Show the user's saved countries, or a message if they haven't saved any yet. Also show the profile form to let them save their name for a personalized greeting
        <div className="saved-countries" style={{color: "var(--text-primary)"}}>


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


            <h2 className="profile-heading">
                {profile.name ? `Welcome back, ${profile.name}!` : "My Profile"}
            </h2>

            <ProfileForm />

        </div>
    );
}

export default SavedCountries;
