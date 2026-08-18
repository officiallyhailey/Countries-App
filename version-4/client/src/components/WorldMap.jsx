import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import SaveCountryBtn from "./SaveCountryBtn";
import "mapbox-gl/dist/mapbox-gl.css";
import "./WorldMap.css";

// the saved countries as pins on a map. it renders the same savedCountries array the card grid gets,
// so unhearting a card removes its pin without this needing a fetch of its own

// vite writes this straight into the built files, so whatever is here is visible to anyone on the site
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// mapbox gives out two kinds of token, and only the public one starting pk is safe to use here.
// the secret kind starting sk can change the account, so anything that isn't a pk token counts as no token
const PUBLIC_TOKEN = TOKEN && TOKEN.startsWith("pk.") ? TOKEN : null;

// the API gives coordinates as [lat, lng] and mapbox takes longitude first, so the swap happens in
// one named place rather than inline on every marker
function toLngLat(country) {
    return { longitude: country.latlng[1], latitude: country.latlng[0] };
}

// a country with no coordinates would render at 0,0 in the gulf of guinea, which reads as a real pin
// rather than as missing data, so those are left off
function hasCoords(country) {
    return Array.isArray(country.latlng) && country.latlng.length === 2;
}

function WorldMap({ countries, isDarkMode, onUnsave }) {
    const navigate = useNavigate();
    // which pin's popup is open. null means none, and the map's click handler resets it to null
    const [selected, setSelected] = useState(null);

    const pinned = useMemo(() => countries.filter(hasCoords), [countries]);

    // with no usable token the map can't load, so this shows instead of an empty grey box
    if (!PUBLIC_TOKEN) {
        return (
            <div className="worldMap worldMapFallback">
                <p>The map is unavailable right now. Your saved countries are listed below.</p>
            </div>
        );
    }

    if (pinned.length === 0) return null;

    // zooms to fit whichever pins are there, so a few saved countries fill the map instead of sitting
    // as tiny dots on a whole world view. maxZoom stops one saved country zooming all the way in
    const fitToPins = (event) => {
        const lngs = pinned.map((c) => c.latlng[1]);
        const lats = pinned.map((c) => c.latlng[0]);
        event.target.fitBounds(
            [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 60, maxZoom: 4, duration: 0 },
        );
    };

    return (
        <div className="worldMap">
            <Map
                mapboxAccessToken={PUBLIC_TOKEN}
                initialViewState={{ longitude: 0, latitude: 20, zoom: 1 }}
                // mapbox draws a globe by default, which leaves the corners of the box empty and shrinks
                // the pins. the flat map fills the whole width instead
                projection="mercator"
                mapStyle={isDarkMode ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"}
                onLoad={fitToPins}
                onClick={() => setSelected(null)}
                style={{ width: "100%", height: "100%" }}
            >
                <NavigationControl position="top-right" showCompass={false} />

                {pinned.map((country) => (
                    <Marker
                        key={country.name}
                        {...toLngLat(country)}
                        anchor="bottom"
                        // without this the click carries on to the map, which would close the popup
                        // the moment it opened
                        onClick={(event) => {
                            event.originalEvent.stopPropagation();
                            setSelected(country);
                        }}
                    >
                        {/* the pin is the country's flag rather than a generic marker, so the map is
                            readable without clicking anything */}
                        <button className="pin" type="button" aria-label={`${country.name} on the map`}>
                            <img
                                src={country.flags.png}
                                alt=""
                                onError={(event) => {
                                    event.target.src = country.flags.svg;
                                }}
                            />
                        </button>
                    </Marker>
                ))}

                {selected && (
                    <Popup
                        {...toLngLat(selected)}
                        // no fixed anchor, so mapbox puts the popup on whichever side has room. pinning it
                        // to one side means a pin near the bottom of the box gets its popup cut off
                        offset={18}
                        // the map's click handler above already clears the selection, so leaving this
                        // on would give two things the same job
                        closeOnClick={false}
                        onClose={() => setSelected(null)}
                        className="pinPopup"
                    >
                        {/* clicking anywhere in here opens the country, the same as the cards did. the heart
                            inside stops its own click spreading, so unsaving doesn't also open the page */}
                        <div
                            className="pinPopupBody"
                            onClick={() => navigate(`/pages/country/${encodeURIComponent(selected.name)}`)}
                        >
                            <img
                                src={selected.flags.png}
                                alt={`${selected.name} flag`}
                                onError={(event) => {
                                    event.target.src = selected.flags.svg;
                                }}
                            />
                            <div>
                                <h3>{selected.name}</h3>
                                <p>{selected.capital}</p>
                                <span>View country</span>
                            </div>

                            {/* everything with a pin is saved already, so the heart starts full and its only
                                job here is unsaving. the popup closes first because its country is about to
                                leave the list it was picked from */}
                            <SaveCountryBtn
                                country={selected}
                                isSaved={true}
                                onUnsave={(name) => {
                                    setSelected(null);
                                    onUnsave(name);
                                }}
                            />
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}

export default WorldMap;
