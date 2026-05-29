import { useState, useEffect } from "react";
import "./DetailCard.css";

function SaveCountry({ country, onUnsave }) {

     // isSaved, setIsSaved is a state variable that tracks whether the current country is saved or not. It is initialized to false, meaning the country is not saved by default.
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkSavedStatus = async () => {
            try {
                const response = await fetch("/api/get-all-saved-countries");
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

    // handleSave is an asynchronous (doesn't block the execution of other code while waiting for a response) function that is triggered when the user clicks the save button. It determines the appropriate API endpoint based on whether the country is currently saved or not, and then sends a POST request to either save or unsave the country.

    const handleSave = async (e) => {
        e.stopPropagation();
        const endpoint = isSaved
            ? "/api/unsave-one-country"
            : "/api/save-one-country";
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

            // Toggle the saved status in the UI immediately after a successful response from the server, and if the country was unsaved, call the onUnsave callback to update the parent component's state accordingly. This ensures that the UI remains responsive and reflects the user's actions without delay.

            setIsSaved(!isSaved);
            if (isSaved && onUnsave) onUnsave(country.name.common);
        } catch (error) {
            console.error("Failed to update saved country:", error);
        }
    };

    // Render a button that shows "♡ Save" when the country is not saved and "♥ Saved" when it is, with appropriate styling for each state. The button's onClick handler will toggle the saved status of the country.
    return (
        <button className={`saveBtn ${isSaved ? "saved" : ""}`} onClick={handleSave}>
            {isSaved ? "❤️" : "🩶"}
        </button>
    );
}

export default SaveCountry;
