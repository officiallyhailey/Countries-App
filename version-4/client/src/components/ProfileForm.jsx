import { useState, useEffect } from "react";
import "./ProfileForm.css";

// profile form: view/edit name, email, country, bio. re-fetches the newest user after a save so the form and the DB stay in sync
function ProfileForm() {
    const [form, setForm] = useState({ name: "", email: "", country: "", bio: "" });
    const [savedName, setSavedName] = useState("");
    const [saved, setSaved] = useState(false);

    // kept as its own function so I can call it again after saving, which is what keeps the form and the greeting matching what's in the DB. the endpoint sends back an array, so data[0] is the newest user
    const getUserNewestInfo = async () => {
        try {
            const response = await fetch("/api/get-newest-user");
            const data = await response.json();
            const user = data[0];
            if (user) {
                setSavedName(user.name || "");
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

    // one function handles all four inputs. [event.target.name] picks which bit of state to update, so each input's name attribute has to match its name in the form state
    const handleChange = (event) => {
        setForm((previousForm) => ({ ...previousForm, [event.target.name]: event.target.value }));
    };

    // saving adds a new row rather than updating the old one, and the app always shows the newest user, so the latest save is the one that shows up
    const handleSubmit = async (event) => {
        // stops the page reloading when the form is submitted
        event.preventDefault();
        try {
            const response = await fetch("/api/add-one-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // rename country -> country_name to match the API
                body: JSON.stringify({ ...form, country_name: form.country }),
            });
            const text = await response.text();
            if (!response.ok) {
                console.error("Server error:", response.status, text);
                return;
            }
            // hides the "Profile saved!" message again after 6 seconds so it doesn't sit there forever
            setSaved(true);
            setTimeout(() => setSaved(false), 6000);
            await getUserNewestInfo();
        } catch (error) {
            console.error("Failed to save user info:", error);
        }
    };

    return (
        <div>
            {/* savedName is separate from form.name so the greeting stays as it was while you're still typing a new name in */}
            <h2 className="profile-heading">
                {savedName ? `Welcome back, ${savedName}!` : "My Profile"}
            </h2>

            {/* every input gets its value from state and sends changes back into it, which is what lets me fill the form in from the DB */}
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
