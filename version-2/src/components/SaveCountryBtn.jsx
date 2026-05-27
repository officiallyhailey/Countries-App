import { useState, useEffect } from "react";
import "./DetailCard.css";

function SaveCountry({ country, onUnsave }) {

     // isSaved, setIsSaved is a state variable that tracks whether the current country is saved or not. It is initialized to false, meaning the country is not saved by default.
    const [isSaved, setIsSaved] = useState(false);

    // useEffect works by defining a function that fetches the list of saved countries from the server and checks if the current country is in that list. Using the async, try, and catch syntax allows us to handle the asynchronous nature of the fetch request and any potential errors that may occur during the process. 
    
    useEffect(() => {
        const checkSavedStatus = async () => {
            try {
                const response = await fetch("https://backend-answer-keys.onrender.com/get-all-saved-countries");
                const data = await response.json();
                const savedNames = data.map((item) =>
                    typeof item === "string" ? item : item.country_name
                );
                setIsSaved(savedNames.includes(country.name.common));
            } catch (error) {
                console.error("Failed to check saved status:", error);
            }
        };
        checkSavedStatus();
    }, [country.name.common]);

    // handleSave is an asynchronous function that is triggered when the user clicks the save button. It determines the appropriate API endpoint based on whether the country is currently saved or not, and then sends a POST request to either save or unsave the country. 
    const handleSave = async (e) => {
        e.stopPropagation();
        const endpoint = isSaved
            ? "https://backend-answer-keys.onrender.com/unsave-one-country"
            : "https://backend-answer-keys.onrender.com/save-one-country";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country_name: country.name.common }),
            });
            const text = await response.text();
            console.log("save response:", text);
            if (!response.ok) {
                console.error("Server error:", response.status, text);
                return;
            }
            setIsSaved(!isSaved);
            if (isSaved && onUnsave) onUnsave(country.name.common);
        } catch (error) {
            console.error("Failed to update saved country:", error);
        }
    };

    // Render a button that shows "♡ Save" when the country is not saved and "♥ Saved" when it is, with appropriate styling for each state. The button's onClick handler will toggle the saved status of the country.
    return (
        <button className={`saveBtn ${isSaved ? "saved" : ""}`} onClick={handleSave}>
            {isSaved ? "♥ Saved" : "♡ Save"}
        </button>
    );
}

export default SaveCountry;
