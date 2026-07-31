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

  // dark mode is kept up here because the darkTheme class goes on the outermost div, so the colours in index.css reach everything inside it
  
  const [countries, setCountries] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // falls back to the local data file if the API fetch fails, so there's still something to show

  useEffect(() => {
    let cancelled = false;

    const getCountries = async () => {
      try {
        const response = await fetch(API);
        const fetched = await response.json();
        if (!cancelled) setCountries(fetched);
      } catch {
        if (!cancelled) setCountries(data);
        console.log("Failed to fetch from API, using local data instead");
      }
    };


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
