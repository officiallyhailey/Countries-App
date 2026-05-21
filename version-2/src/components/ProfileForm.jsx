import { useState, useEffect } from "react";
import "./ProfileForm.css";

//Overview 
// useState is a React hook that allows us to add state to a functional component. We use it to create state variables for the user's profile info (name, email, country, bio) and a variable to show a confirmation message after saving. The initial values for the profile info are empty strings until we fetch the user's info from the server and populate them. The saved_ variable is initially false and will be set to true when the user saves their profile, which will trigger the confirmation message to show.

//useEffect is a React hook that allows us to perform side effects in a functional component, such as fetching data from an API. We use it to fetch the newest user info from the server when the component mounts (the empty dependency array means it only runs once) and to update the form fields whenever we fetch new user info. This way, when the user saves their profile and we fetch the newest info again, the form will update to show any changes from the server.    

// The ProfileForm component is a form that allows the user to view and edit their profile information, including their name, email, country, and bio. When the component mounts, it fetches the newest user info from the server and populates the form fields with that info. The user can then edit the fields and submit the form to save their profile info to the server. After saving, a confirmation message is shown and the newest user info is fetched again to update the form with any changes from the server. The component uses state to manage the form fields and the confirmation message, and useEffect to handle fetching data from the server when needed.

function ProfileForm() {

    const [newUserInfo, setNewUserInfo] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [bio, setBio] = useState("");
    const [saved_, setSaved] = useState(false);

    // Function to fetch the newest user info from the server and update state
    const getUserNewestInfo = async () => {
        try {
            const response = await fetch(
                "https://backend-answer-keys.onrender.com/get-newest-user"
            );
            const data = await response.json();
            console.log("data:", data);
            setNewUserInfo(data[0]);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    useEffect(() => {
        getUserNewestInfo();
    }, []);

    // When new user info is fetched, update the form fields to show it
    useEffect(() => {
        if (newUserInfo) {
            setName(newUserInfo.name || "");
            setEmail(newUserInfo.email || "");
            setCountry(newUserInfo.country_name || "");
            setBio(newUserInfo.bio || "");
        }
    }, [newUserInfo]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                'https://backend-answer-keys.onrender.com/add-one-user',
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, country_name: country, bio }),
                }
            );
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
                {newUserInfo?.name ? `Welcome back, ${newUserInfo.name}!` : "My Profile"}
            </h2>

            <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
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

        </div>
    );
}


export default ProfileForm;
