import { Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import "./App.css";

function App() {

  return (
      <div className="App">
        <Header />

        <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Navigate to="pages/home" replace />} />
          <Route path="pages/home" element={<Home />} />
          <Route path="pages/saved-countries" element={<SavedCountries />} />
        </Routes>
      </div>
      </div>
  );
}

export default App;
