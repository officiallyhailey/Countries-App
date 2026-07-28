import { useState, useEffect } from "react";
import "./SaveCountryBtn.css";

// the heart button, used on both the cards and the detail page. isSaved comes from the parent so a grid of cards only checks the saved list once, instead of every card fetching it independently. it's renamed to isSavedProp because there's a local state version too, the prop is the starting value and the state is what the button actually shows
function SaveCountryBtn({ country, isSaved: isSavedProp, onUnsave }) {
    const [isSaved, setIsSaved] = useState(isSavedProp);

    // useState only uses its starting value the first time round, so this effect updates the heart if the parent's fetch comes back after that
    useEffect(() => {
        setIsSaved(isSavedProp);
    }, [isSavedProp]);

    //stopPropagation is used to prevent the click event from bubbling up to the parent card, which would trigger a navigation to the country details page.
    // the same button does both jobs, it just picks the save or the unsave endpoint depending on whether it's already saved
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

export default SaveCountryBtn;
