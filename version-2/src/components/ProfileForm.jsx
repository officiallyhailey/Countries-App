import { useState, useEffect } from "react";
import "./ProfileForm.css";

// profile form: view and edit name, email, country and bio. it loads the newest user when the page opens and fetches again after saving, so the form and the greeting match what's in the DB
function ProfileForm() {
    const [form, setForm] = useState({ name: "", email: "", country: "", bio: "" });
    const [savedName, setSavedName] = useState("");
    const [saved, setSaved] = useState(false);

    // kept as its own function so it can be called again after saving, which is what keeps the form and the greeting matching what's in the DB. the endpoint sends back an array, so data[0] is the newest user
    const getUserNewestInfo = async () => {
        try {
            const response = await fetch("/api/get-newest-user");
            const data = await response.json();
            console.log("data:", data);
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

    const handleSubmit = async (event) => {
        // stops the page reloading when the form is submitted
        event.preventDefault();
        try {
            const response = await fetch("/api/add-one-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // the form calls it country but the API expects country_name
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
                {savedName ? `Welcome back, ${savedName}!` : "My Profile"}
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