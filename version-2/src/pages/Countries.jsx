import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CountryCards from "../components/CountryCard";
import "./countries-filter.css";

// The home page with the search bar, region filter, and grid of country cards. It loads the full list of countries from the API (or local data if the API fails) and passes it down to the CountryCard component, which handles displaying the cards in a grid. The search and region filter are implemented here in the Home component, and the filtered list of countries is passed down to CountryCard to display. 

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
                        <FontAwesomeIcon icon={faSearch} className="searchIcon" />
                        <input type="text" placeholder="Search for a country..." onChange={handleSearch} />
                    </div>
                    <div className="filters">
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
                <CountryCards countries={filteredCountries} />
            </div>
        );
    }
    export default Home;
