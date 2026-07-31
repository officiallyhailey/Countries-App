// App fetches the countries once and passes the list to every page as a prop, so nothing else has to fetch them again. dark mode is kept here too because the darkTheme class needs to go on the outermost div for the colours in index.css to apply to everything
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";

import Countries from "./pages/Countries";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";
import "./App.css";
import data from "/localData.js";

// only asking for the fields I actually display, so the response + loading time stays small
const API = "https://countries.dev/countries?fields=name,flags,alpha3Code,population,region,capital,borders";

// localData.js is saved in the restcountries format, so it gets reshaped into the same shape the API sends before anything uses it
function toCountriesDevShape(country) {
  return {
    name: country.name.common,
    flags: { png: country.flags?.png, svg: country.flags?.svg },
    alpha3Code: country.cca3,
    population: country.population,
    region: country.region,
    capital: country.capital,
    borders: country.borders,
  };
}

function App() {
  const [countries, setCountries] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // fall back to local data if the API fetch fails. the cancelled flag is there so that if you leave before the fetch finishes, it skips setting state on a component that's already gone
  useEffect(() => {
    let cancelled = false;

    const getCountries = async () => {
      try {
        const response = await fetch(API);
        const fetched = await response.json();
        if (!cancelled) setCountries(fetched);
      } catch {
        if (!cancelled) setCountries(data.map(toCountriesDevShape));
        console.log("Failed to fetch from API, using local data instead");
      }
    };

    getCountries();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={`App ${isDarkMode ? "darkTheme" : ""}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="mainContainer">
        {/* "/" and "pages/home" both show the Countries page, so clicking the title and typing the plain URL end up in the same place */}
        <Routes>
          <Route path="/" element={<Countries countries={countries} />} />
          <Route path="pages/home" element={<Countries countries={countries} />} />
          <Route path="pages/saved-countries" element={<SavedCountries countries={countries} />} />
          <Route path="pages/country/:name" element={<CountryDetail countries={countries} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
