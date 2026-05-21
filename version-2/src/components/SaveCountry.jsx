import { useState, useEffect } from "react";
import "./DetailCard.css";

function SaveCountry({ country }) {

    // State to track whether this country is currently saved, initialized to false until we check localStorage
    const [isSaved, setIsSaved] = useState(false);

    // When the component mounts, check localStorage to see if this country is in the saved list and update state accordingly. localStorage is saved in a file on the user's computer, so this allows the saved countries to persist even if they close the browser or refresh the page. We use JSON.parse to convert the saved countries string back into an array that we can check for the current country. If the country is in the saved list, we set isSaved to true so that the button will show as saved.
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
        // The button's className changes based on whether the country is saved, allowing for different styling. The button text also changes to indicate whether the country is currently saved or not. When the button is clicked, it calls handleSave to toggle the saved state and update localStorage.
        <button className={`saveBtn ${isSaved ? "saved" : ""}`} onClick={handleSave}>
            {isSaved ? "♥ Saved" : "♡ Save"}
        </button>
    );
}

export default SaveCountry;