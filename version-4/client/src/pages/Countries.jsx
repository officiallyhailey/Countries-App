import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CountryCard from "../components/CountryCard";
import "./Countries.css";

// home page: search bar, region filter, and the full country grid. the countries come in as a prop from App, so this page only keeps track of what's been typed and picked

// used as both the default dropdown label and the "show everything" value, so there's only one string to check against
const allRegions = "Filter by Region";

function Countries({ countries }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegion, setSelectedRegion] = useState(allRegions);

    // building the region list from the countries themselves instead of typing them out, so it still matches if the data changes. useMemo means it only rebuilds when the country list does, not every time you type in the search box
    const regions = useMemo(() => {
        const uniqueRegions = new Set(countries.map((country) => country.region));
        return Array.from(uniqueRegions);
    }, [countries]);

    // both filters run together, so picking a region and typing a name narrows the list down instead of one cancelling the other out
    const filteredCountries = useMemo(() => {
        return countries.filter((country) => {
            const matchesSearch = country.name.common.toLowerCase().includes(searchTerm);
            const matchesRegion = selectedRegion === allRegions || country.region === selectedRegion;
            return matchesSearch && matchesRegion;
        });
    }, [countries, searchTerm, selectedRegion]);

    // making the search term lowercase here to match the lowercase name above, so it doesn't matter if you type capitals
    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
    };

    return (
        <div className="home">
            <div className="filter">
                <div className="searchBar">
                    <FontAwesomeIcon icon={faSearch} className="searchIcon" />
                    <input type="text" placeholder="Search for a country..." onChange={handleSearch} />
                </div>
                <div className="filters">
                    {/* the wrapper is here so I can hide the default dropdown arrow in CSS and put my own icon on top */}
                    <div className="selectWrapper">
                        <select value={selectedRegion} onChange={handleRegionChange}>
                            <option value={allRegions}>{allRegions}</option>
                            {regions.map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className="selectIcon" />
                    </div>
                </div>
            </div>
            <CountryCard countries={filteredCountries} />
        </div>
    );
}

export default Countries;
