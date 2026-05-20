import { useState, useEffect } from "react";
import "./DetailCard.css";

function SaveCountry({ country }) {

    // State to track whether this country is currently saved, initialized to false until we check localStorage
    const [isSaved, setIsSaved] = useState(false);

    // When the component mounts, check localStorage to see if this country is in the saved list and update state accordingly
    useEffect(() => { const savedKey = "savedCountries";
        const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
        setIsSaved(saved.includes(country.name.common));
    }, [country]);

    const handleSave = (e) => {
        //stops the page from refreshing when the button is clicked, and also stops the click from propagating up to the card's onClick handler which would count as a search to the detail page, increasing the countKey by 1 which isn't accurate 
        e.stopPropagation();
        const key = "savedCountries";
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = isSaved
            ? saved.filter((c) => c !== country.name.common)
            : [...saved, country.name.common];
        localStorage.setItem(key, JSON.stringify(updated));
        setIsSaved(!isSaved);
    };

    return (
        <button className={`saveBtn ${isSaved ? "saved" : ""}`} onClick={handleSave}>
            {isSaved ? "♥ Saved" : "♡ Save"}
        </button>
    );
}

export default SaveCountry;