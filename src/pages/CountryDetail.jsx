import DetailCard from "../components/DetailCard";
import { useParams } from "react-router-dom";
import data from "/localData.js";
import "./CountryDetail.css";

function CountryDetail() {
    const { name } = useParams();
    const country = data.find((c) => c.name.common === decodeURIComponent(name));

    if (!country) {
        return (
            <div className="mainContainer">
                <p style={{ color: "var(--text-secondary)" }}>Country not found.</p>
            </div>
        );
    }

    return (
        <div className="mainContainer">
            <DetailCard country={country} allCountries={data} />
        </div>
    );
}

export default CountryDetail;
