import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";
import "./App.css";
//Set up routing for the application, including a default route that redirects to the home page
function App() {
  return (
    <div className="App">
      <Header />

      <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Navigate to="pages/home" replace />} />
          <Route path="pages/home" element={<Home />} />
          <Route path="pages/saved-countries" element={<SavedCountries />} />
          <Route path="pages/country/:name" element={<CountryDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
