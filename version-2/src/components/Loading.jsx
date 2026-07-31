import { useState, useEffect } from "react";
import localData from "../../localData.js";

// loading screen that flicks through flags instead of a spinner. the flags come from the local data file rather than the API, because this is what shows while the API request is still going
const FLAGS = localData
    .filter((c) => c.flags?.png)
    .map((c) => ({ png: c.flags.png, svg: c.flags.svg, name: c.name.common }));

const INTERVAL_MS = 300;

function Loading() {
    // starts on a random flag so a quick load isn't always the same one. writing it as a function means it only picks once, instead of picking a new random number on every render
    const [index, setIndex] = useState(() =>
        Math.floor(Math.random() * FLAGS.length),
    );

    // the % wraps back round to the first flag when it reaches the end, so it never runs out. clearInterval stops the timer once loading is done and this disappears
    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % FLAGS.length);
        }, INTERVAL_MS);
        return () => clearInterval(id);
    }, []);

    const current = FLAGS[index];

    // the styles are written inline here because this loading screen is the only thing using them, so there's no CSS file for it
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
