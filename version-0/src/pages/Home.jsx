import data from "/localData.js";
import CountryCards from "../components/CountryCard";
import { useState, useMemo } from 'react';
import "./Home.css";

const allRegions = "Filter by Region";

function Home() {

    // countries starts as the whole list and gets replaced by the filtered version when you search or pick a region
    const [countries, setCountries] = useState(data);

    // building the region list from the data itself instead of typing them out, so it still matches if the data changes
    const regions = useMemo(() => {
        const uniqueRegions = new Set(data.map((country) => country.region));
        return Array.from(uniqueRegions);
    }, []);

    // both handlers filter from data rather than countries, so a new search starts from the full list instead of narrowing what's already been narrowed
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredCountries = data.filter((country) =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        setCountries(filteredCountries);
    };
    const handleRegionChange = (event) => {
        const selectedRegion = event.target.value;
        const filteredCountries = selectedRegion === allRegions
            ? data
            : data.filter((country) => country.region === selectedRegion);
        setCountries(filteredCountries);
    };


    return (
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