import { useState, useEffect } from "react";
import "./ProfileForm.css";

function ProfileForm() {

    const [newUserInfo, setNewUserInfo] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [bio, setBio] = useState("");

    // Show a confirmation message after saving
    const [saved_, setSaved] = useState(false);

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

    useEffect(() => {
        if (newUserInfo) {
            setName(newUserInfo.name || "");
            setEmail(newUserInfo.email || "");
            setCountry(newUserInfo.country_name || "");
            setBio(newUserInfo.bio || "");
        }
    }, [newUserInfo]);

    
    // POST request code for later using instructor API 

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch(
    //             'https://backend-answer-keys.onrender.com/add-one-user',
    //             {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ name, email, country_name: country, bio }),
    //             }
    //         );
    //         const text = await response.text();
    //         console.log("save response:", text);
    //         if (!response.ok) {
    //             console.error("Server error:", response.status, text);
    //             return;
    //         }
    //         setSaved(true);
    //         setTimeout(() => setSaved(false), 6000);
    //         await getUserNewestInfo();
    //     } catch (error) {
    //         console.error("Failed to save user info:", error);
    //     }
    // };


        const handleSubmit = (e) => {
        e.preventDefault(); // stop the page from refreshing!

        // Save all fields to localStorage as one object
        localStorage.setItem(
            "userProfile",
            JSON.stringify({ name, email, country, bio }),
        );
        setSaved(true);
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

        </div>
    );
}


export default ProfileForm;
