import { useState, useEffect } from "react";
import "./DetailCard.css";

function SaveCountry({ country }) {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => { const savedKey = "savedCountries";
        const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
        setIsSaved(saved.includes(country.name.common));
    }, [country]);

    const handleSave = () => {
        const key = "savedCountries";
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = isSaved
            ? saved.filter((c) => c !== country)
            : [...saved, country];
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