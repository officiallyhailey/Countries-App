import DetailCard from "../components/DetailCard";
import { useParams } from "react-router-dom";

// takes the country name out of the URL, finds that country in the list, and hands it to DetailCard which does the actual displaying
function CountryDetail({ countries }) {
    const { name } = useParams();
    const allCountries = countries;
    // the name gets encoded when we link to it, so it has to be decoded back before comparing ("Ivory%20Coast" turns into "Ivory Coast")
    const country = allCountries.find(
        (c) => c.name.common === decodeURIComponent(name),
    );

    // this also catches the moment before App's fetch has finished, when the list is still empty
    if (!country) return <p>Country not found.</p>;

    return (
        <div className="mainContainer">
            <DetailCard country={country} allCountries={allCountries} />
        </div>
    );
}

export default CountryDetail;
