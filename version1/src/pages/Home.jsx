import { useState, useMemo } from 'react';
import CountryCards from "../components/CountryCard";
import "./Home.css";

const allRegions = "Filter by Region";

function Home({ countries }) {
        const [searchTerm, setSearchTerm] = useState("");
        const [selectedRegion, setSelectedRegion] = useState(allRegions);

        const regions = useMemo(() => {
            const uniqueRegions = new Set(countries.map((country) => country.region));
            return Array.from(uniqueRegions);
        }, [countries]);

        const filteredCountries = useMemo(() => {
            return countries.filter((country) => {
                const matchesSearch = country.name.common.toLowerCase().includes(searchTerm);
                const matchesRegion = selectedRegion === allRegions || country.region === selectedRegion;
                return matchesSearch && matchesRegion;
            });
        }, [countries, searchTerm, selectedRegion]);

        const handleSearch = (event) => {
            setSearchTerm(event.target.value);
        };

        const handleRegionChange = (event) => {
            setSelectedRegion(event.target.value);
        };

        
        return (
            <div className="home">
                <div className="filter">
                    <div className="searchBar">
                        <input type="text" placeholder="Search for a country..." onChange={handleSearch} />
                    </div>
                    <div className="filters">
                        <select value={selectedRegion} onChange={handleRegionChange}>
                            <option value={allRegions}>{allRegions}</option>
                            {regions.map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <CountryCards countries={filteredCountries} />
            </div>
        );
    }
    export default Home;
