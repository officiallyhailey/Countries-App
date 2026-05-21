import { useState, useEffect } from "react";
import "./ProfileForm.css";

// ProfileForm lets the user view and edit their profile (name, email, country, bio).
// On mount it fetches the latest info from the server and fills the form.
// On submit it saves the changes, shows a confirmation, then re-fetches to stay in sync.

function ProfileForm() {

    // One state object holding all four form fields
    const [form, setForm] = useState({ name: "", email: "", country: "", bio: "" });
    const [saved, setSaved] = useState(false);

    // Fetch the newest user info and sets it directly on the form state so the form fields are pre-filled with the latest data.
    const getUserNewestInfo = async () => {
        try {
            const response = await fetch("/api/get-newest-user");
            const data = await response.json();
            console.log("data:", data);
            const user = data[0];
            if (user) {
                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    country: user.country_name || "",
                    bio: user.bio || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    useEffect(() => {
        getUserNewestInfo();
    }, []);

    // One handler for all inputs using the input's name attribute as the form key
    // [event.target.name] is a computed property name (the variable becomes the key)
    // ...previousForm spreads all existing fields so we only overwrite the one that changed
    const handleChange = (event) => {
        setForm((previousForm) => ({ ...previousForm, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/add-one-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Spreads form fields and renames country → country_name to match the API
                body: JSON.stringify({ ...form, country_name: form.country }),
            });
            const text = await response.text();
            console.log("save response:", text);
            if (!response.ok) {
                console.error("Server error:", response.status, text);
                return;
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 6000);
            await getUserNewestInfo();
        } catch (error) {
            console.error("Failed to save user info:", error);
        }
    };

    return (
        <div>
            <h2 className="profile-heading">
                {form.name ? `Welcome back, ${form.name}!` : "My Profile"}
            </h2>

            <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email"
                    />
                </label>

                <label>
                    Country
                    <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Where are you from?"
                    />
                </label>

                <label>
                    Bio
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                    />
                </label>

                <button type="submit">Save Profile</button>

                {saved && <p className="saved-confirm">Profile saved!</p>}
            </form>
        </div>
    );
}

export default ProfileForm;