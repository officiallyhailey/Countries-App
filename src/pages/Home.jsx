import data from "/localData.js";
import CountryCards from "../components/CountryCard";
import { useState, useMemo } from 'react';
import "./Home.css";

const ALL_REGIONS = "Filter by Region";

function Home() {
    const [countries, setCountries] = useState(data);
    
    const regions = useMemo(() => {
        const uniqueRegions = new Set(data.map((country) => country.region));
        return Array.from(uniqueRegions);
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredCountries = data.filter((country) =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        setCountries(filteredCountries);
    };

    const handleRegionChange = (event) => {
        const selectedRegion = event.target.value;
        const filteredCountries = selectedRegion === ALL_REGIONS
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
                        <option value={ALL_REGIONS}>{ALL_REGIONS}</option>
                        {regions.map((region) => (
                            <option key={region.value} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
            </div>
            <CountryCards countries={countries} />
        </div>
    );
}


export default Home; 