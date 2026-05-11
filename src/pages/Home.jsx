import data from "/localData.js";
import CountryCards from "../components/CountryCard";
import { useState, useMemo } from 'react';
import "./Home.css";

const allRegions = "Filter by Region";

function Home() {

    // Initialize the countries state with the data from localData.js
    const [countries, setCountries] = useState(data);

    // Use useMemo to compute the unique regions from the data, ensuring it only recomputes when the data changes
    
    const regions = useMemo(() => {
        const uniqueRegions = new Set(data.map((country) => country.region));
        return Array.from(uniqueRegions);
    }, []);

    // Handler for the search input, filters countries based on the search term
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredCountries = data.filter((country) =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        setCountries(filteredCountries);
    };
// Handler for the region select dropdown, filters countries based on the selected region
    const handleRegionChange = (event) => {
        const selectedRegion = event.target.value;
        const filteredCountries = selectedRegion === allRegions
            ? data
            : data.filter((country) => country.region === selectedRegion);
        setCountries(filteredCountries);
    };


    return (
        // Render the search bar, region filter, and the country cards
        <div className="home">
            <div className="filter">
                <div className="searchBar">
                    <input type="text" placeholder="Search for a country..." onChange={handleSearch}
                    />
                </div>
                <div className="filters">
                    <select onChange={handleRegionChange}>
                        <option value={allRegions}>{allRegions}</option>
                        {regions.map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
            </div>
            <CountryCards countries={countries} />
        </div>
    );
}


export default Home; 