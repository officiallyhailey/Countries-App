import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import Header from "./components/Header";

import Home from "./pages/Countries";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";
import "./App.css";
import data from "/localData.js";

const API = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3,borders";

function App() {

  // State for the list of all countries, and whether dark mode is on
  
  const [countries, setCountries] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(prev => !prev);

// Load the country data from the API, or fall back to local data if the fetch fails

  useEffect(() => {
    let cancelled = false;

    const getCountries = async () => {
      try {
        const response = await fetch(API);
        const fetched = await response.json();
        if (!cancelled) setCountries(fetched);
      } catch {
        if (!cancelled) setCountries(data);
        console.log("Failed to fetch from API, using local data instead.");
      }
    };

// Call the function to load countries when the component boots

    getCountries();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={`App ${isDarkMode ? 'darkTheme' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Home countries={countries} />} />
          <Route path="pages/home" element={<Home countries={countries} />} />
          <Route path="pages/saved-countries" element={<SavedCountries countries={countries} />} />
          <Route path="pages/country/:name" element={<CountryDetail countries={countries} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
