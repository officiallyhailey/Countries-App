import CountryCard from "../components/CountryCard";
import ProfileForm from "../components/ProfileForm";
import "/src/index.css";


// saved page: the countries you've hearted, plus the profile form. localStorage only holds the names, so this page matches those names against the full list to get the flags and the rest of the info

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
        <div className="saved-countries" style={{color: "var(--text-primary)"}}>


            <h1>My Saved Countries</h1>

            {savedCountries.length === 0 ? (
                <p className="empty-message">
                    No saved countries yet. Open a country and click ♡ Save to add it here!
                </p>
            ) : (
                // same grid as the home page, just given a shorter list
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
