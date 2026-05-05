import "./CountryCard.css";

function CountryCard({ countries }) {
    return (
        <div className="countryCard">
            {countries.map((country) => (
                <div key={country.name.common} className="card">
                    
                    <img src={country.flags.png} alt={`${country.name.common} flag`} className="flag" />
                    <div className="cardContent">
                    <h2>{country.name.common}</h2>
                    <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> {country.region}</p>
                    <p><strong>Capital:</strong> {country.capital}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CountryCard;