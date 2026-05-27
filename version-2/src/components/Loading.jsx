import { useState, useEffect } from "react";
import localData from "../../localData.js";

// FLAGS is an array of objects, each containing the png and svg URLs of a country's flag, as well as the country's common name. This array is created by filtering the localData to include only countries that have a png flag, and then mapping over the filtered data to extract the relevant information for each country. This allows us to easily access and display the flags in our loading component.
const FLAGS = localData
    .filter((c) => c.flags?.png)
    .map((c) => ({ png: c.flags.png, svg: c.flags.svg, name: c.name.common }));

// INTERVAL_MS is a constant that defines the time interval (in milliseconds) at which the loading component will cycle through the different flags. In this case, it is set to 300 milliseconds, meaning that the displayed flag will change every 0.3 seconds while the loading component is active.
const INTERVAL_MS = 300;

function Loading() {
    const [index, setIndex] = useState(() =>
        Math.floor(Math.random() * FLAGS.length),
    );

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % FLAGS.length);
        }, INTERVAL_MS);
        return () => clearInterval(id);
    }, []);

    const current = FLAGS[index];

    // kept the css directly in this component since it's only used here and it felt more efficient to manage it this way rather than creating a separate CSS file for a single component. This approach allows for easier maintenance and quicker adjustments to the styling without having to navigate between multiple files.
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80vh",
                gap: "1.5rem",
                color: "var(--text-primary)",
                background: "transparent",
            }}
        >
            <img
                key={current.png}
                src={current.png}
                alt={current.name}
                onError={(e) => {
                    if (current.svg) e.currentTarget.src = current.svg;
                }}
                style={{
                    width: "260px",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    transition: "opacity 0.15s ease-in-out",
                }}
            />
            <h2>Loading...</h2>
        </div>
    );
}

export default Loading;
