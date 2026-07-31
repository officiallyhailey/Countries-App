import { useState, useEffect } from "react";
import "./DetailCard.css";

// the heart button, used on the cards and on the detail page. it asks the server whether this country is already saved so the heart shows the right state when the page opens
function SaveCountry({ country, onUnsave }) {
    // starts empty and gets corrected by the fetch below, so the heart is grey for a moment until the server answers
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

    // the same button does both jobs, it just picks the save or the unsave endpoint depending on whether it's already saved
    const handleSave = async (e) => {
        // the card around this button opens the country when it's clicked, so the click gets stopped here or saving would send you to the detail page as well
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

            // only changing the heart after the server says it worked, so it can't show as saved when the request failed
            setIsSaved(!isSaved);
            // isSaved is still the old value at this point, so this only runs when unsaving. it tells the saved page to take this card off its list
            if (isSaved && onUnsave) onUnsave(country.name.common);
        } catch (error) {
            console.error("Failed to update saved country:", error);
        }
    };

    return (
        <button className={`saveBtn ${isSaved ? "saved" : ""}`} onClick={handleSave}>
            {isSaved ? "❤️" : "🩶"}
        </button>
    );
}

export default SaveCountry;
