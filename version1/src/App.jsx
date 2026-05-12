import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Header from "./components/Header";
import Home from "./pages/Home";
import data from "/localData.js";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";
import "./App.css";
//Set up routing for the application, including a default route that redirects to the home page

const API = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3,borders";

function App() {
  const [countries, setCountries] = useState([]);

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

    getCountries();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="App">
      <Header />

      <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Navigate to="pages/home" replace />} />
          <Route path="pages/home" element={<Home countries={countries} />} />
          <Route path="pages/saved-countries" element={<SavedCountries countries={countries} />} />
          <Route path="pages/country/:name" element={<CountryDetail countries={countries} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
