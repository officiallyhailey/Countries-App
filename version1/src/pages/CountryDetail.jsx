import DetailCard from "../components/DetailCard";
import { useParams } from "react-router-dom";
import "./CountryDetail.css";

//displays the detail card from the API or the local data if the API fails - has an error message as a placeholder in the event
function CountryDetail({ countries }) {
    const { name } = useParams();
    const allCountries = countries;
    const country = allCountries.find((c) => c.name.common === decodeURIComponent(name));

    if (!country) return <p>Country not found.</p>;

    return (
        <div className="mainContainer">
            <DetailCard country={country} allCountries={allCountries} />
        </div>
    );
}

export default CountryDetail;
