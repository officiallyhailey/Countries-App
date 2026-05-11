import { useState } from "react";
import "./ProfileForm.css";

function ProfileForm() {
    // Load any previously saved profile from localStorage
    const saved = JSON.parse(localStorage.getItem("userProfile") || "{}");

    // One piece of state per form field, pre-filled with saved values
    const [name, setName] = useState(saved.name || "");
    const [email, setEmail] = useState(saved.email || "");
    const [country, setCountry] = useState(saved.country || "");
    const [bio, setBio] = useState(saved.bio || "");

    // Show a confirmation message after saving
    const [saved_, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // stop the page from refreshing

        // Save all fields to localStorage as one object
        localStorage.setItem(
            "userProfile",
            JSON.stringify({ name, email, country, bio }),
        );
        setSaved(true);
    };

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <label>
                Name
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
            </label>

            <label>
                Email
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                />
            </label>

            <label>
                Country
                <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Where are you from?"
                />
            </label>

            <label>
                Bio
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                />
            </label>

            <button type="submit">Save Profile</button>

            {/* Show confirmation only after the user saves */}
            {saved_ && <p className="saved-confirm">Profile saved!</p>}
        </form>
    );
}

export default ProfileForm;
