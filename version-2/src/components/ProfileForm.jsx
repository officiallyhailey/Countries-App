import { useState, useEffect } from "react";
import "./ProfileForm.css";

//Overview 
// useState is a React hook that allows us to add state to a functional component. We use it to create state variables for the user's profile info (name, email, country, bio) and a variable to show a confirmation message after saving. The initial values for the profile info are empty strings until we fetch the user's info from the server and populate them. The saved_ variable is initially false and will be set to true when the user saves their profile, which will trigger the confirmation message to show.

//useEffect is a React hook that allows us to perform side effects in a functional component, such as fetching data from an API. We use it to fetch the newest user info from the server when the component mounts (the empty dependency array means it only runs once) and to update the form fields whenever we fetch new user info. This way, when the user saves their profile and we fetch the newest info again, the form will update to show any changes from the server.    

// The ProfileForm component is a form that allows the user to view and edit their profile information, including their name, email, country, and bio. When the component mounts, it fetches the newest user info from the server and populates the form fields with that info. The user can then edit the fields and submit the form to save their profile info to the server. After saving, a confirmation message is shown and the newest user info is fetched again to update the form with any changes from the server. The component uses state to manage the form fields and the confirmation message, and useEffect to handle fetching data from the server when needed.

function ProfileForm() {
    //useState is used to create state variables for the component. newUserInfo will hold the newest user information fetched from the server, and we initialize it to null until we fetch the data. Null needs to be specified as the initial value because we want to indicate that we haven't loaded any user info yet. Once we fetch the data, we will update this state variable with the user's info, which will trigger a re-render of the component to show the updated info in the form fields.
    const [newUserInfo, setNewUserInfo] = useState(null);

    // State for each form field, initialized to empty strings until we fetch the user's info and populate them. We need empty strings because the form fields are controlled components, which means their values are controlled by React state. By starting with empty strings, we ensure that the form fields are always defined and can be updated smoothly when we fetch the user's info from the server.
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [bio, setBio] = useState("");

    // Show a confirmation message after saving by setting saved_ to true. We initialize it to false because we don't want to show the confirmation message until the user actually saves their profile. 
    const [saved_, setSaved] = useState(false);

    // Function to fetch the newest user info from the server and update state
    const getUserNewestInfo = async () => {
        try {
            const response = await fetch(
                "https://backend-answer-keys.onrender.com/get-newest-user"
            );
            const data = await response.json();
            console.log("data:", data);
            // Assuming the API returns an array of user info, we take the first one (the newest) and set it in state so we can use it to populate the form fields. State means that when we update it, the component will re-render and show the new info in the form.
            setNewUserInfo(data[0]);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    // Fetch the newest user info when the component mounts. 
    // useEffect with an empty dependency array means this will only run once when the component first renders. This way, we load the user's profile info from the server as soon as they open the profile page, and we can show that info in the form fields for them to view and edit.
    useEffect(() => {
        getUserNewestInfo();
    }, []);

    // When new user info is fetched, update the form fields to show it
    useEffect(() => {
        if (newUserInfo) {
            // If the API doesn't return a value for a field, we default to an empty string so the form doesn't break and just shows an empty field instead of "undefined" or something like that. Set means that when we update the state, the component will re-render and show the new info in the form fields. 
            setName(newUserInfo.name || "");
            setEmail(newUserInfo.email || "");
            setCountry(newUserInfo.country_name || "");
            setBio(newUserInfo.bio || "");
        }
        // We include newUserInfo in the dependency array so that this effect runs whenever we fetch new user info from the server and update the state with it. 
    }, [newUserInfo]);

    
    // POST request code for later using instructor API 
    // The handleSubmit function is called when the user submits the form. It sends a POST request to the server with the user's profile info in the body of the request.
    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior which would cause a page reload. We want to handle the submission with our own code instead. This allows us to send the form data to the server using fetch and update the UI without reloading the page which  would cause us to lose the current state of the component and any unsaved changes in the form, so we use e.preventDefault() to stop that from happening and handle everything with JavaScript instead.
        e.preventDefault();
        try {
            const response = await fetch(
                'https://backend-answer-keys.onrender.com/add-one-user',
                {
                    // We send the form data as JSON in the body of the POST request. The server can then parse this JSON to get the user's profile info and save it to the database. The headers specify that we're sending JSON data, which is important for the server to know how to parse the request body.
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Stringify means that we convert the JavaScript object with the user's profile info into a JSON string that can be sent in the body of the request. The server will then parse this JSON string back into an object to access the user's info and save it. We include the name, email, country, and bio from the form fields in this object, so that when the user submits the form, all of their profile info is sent to the server to be saved.
                    body: JSON.stringify({ name, email, country_name: country, bio }),
                }
            );
            // We log the response from the server for debugging purposes. The response may contain information about whether the save was successful or if there were any errors. By logging it, we can see what the server is sending back and troubleshoot if something goes wrong.
            const text = await response.text();
            console.log("save response:", text);
            if (!response.ok) {
                // response.status comes from the server and indicates whether the request was successful (e.g. 200) or if there was an error (e.g. 400 or 500). If the response is not ok, we log an error message with the status code and any text from the response to help us understand what went wrong. Then we return early to stop the function from continuing, since we don't want to show a confirmation message or fetch new user info if there was an error saving.
                console.error("Server error:", response.status, text);
                return;
            }
            // After saving, show the confirmation message and fetch the newest user info to update the form with any changes from the server 
            setSaved(true);
            
            // Hide the confirmation message after a few seconds so it doesn't stay on the screen forever. 6000 milliseconds = 6 seconds, which should be enough time for the user to see the confirmation before it disappears. We use setTimeout to schedule a function to run after a delay, which in this case will set saved_ back to false to hide the confirmation message.
            setTimeout(() => setSaved(false), 6000);
            await getUserNewestInfo();
        } catch (error) {
            // error comes from the fetch request if there was a network error or some other issue that prevented the request from completing. We log an error message with the details of the error to help us understand what went wrong when trying to save the user's profile info.
            console.error("Failed to save user info:", error);
        }
    };

    return (

        <div>
            <h2 className="profile-heading">
            {/* newUserInfo?.name uses optional chaining to check if newUserInfo exists and has a name property before trying to access it. If newUserInfo is null or undefined, it will short-circuit and return undefined instead of throwing an error. This way, we can safely check if the user's name is available without worrying about the component crashing if the data hasn't loaded yet. If the user's name is available, we show a personalized welcome message. If not, we just show "My Profile" as a generic heading. */}
                {newUserInfo?.name ? `Welcome back, ${newUserInfo.name}!` : "My Profile"}
            </h2>

            <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                    // The value of each form field is controlled by the corresponding state variable (e.g. name, email, country, bio). When the user types in the input, the onChange handler updates the state with the new value, which causes the component to re-render and show the updated value in the form field. This is called a controlled component because React is controlling the value of the input through state. The placeholder text provides a hint to the user about what to enter in each field.
                        value={name}
                        // target.value comes from the input event when the user types in the field. We use setName to update the name state variable with the new value from the input, which causes the component to re-render and show the updated name in the form field. This way, as the user types, the form stays in sync with the state and shows what they've entered.
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
                        // rows specifies the number of visible text lines for the textarea. Setting it to 4 means that the textarea will show 4 lines of text by default, which gives the user more space to write their bio compared to a single-line input. The user can still type more than 4 lines, but this sets the initial size of the textarea when it renders.
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
