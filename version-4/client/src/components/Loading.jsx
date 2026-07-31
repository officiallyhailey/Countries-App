import { useState, useEffect } from "react";
import localData from "../../localData.js";
import "./Loading.css";

// loading screen that flicks through flags instead of a spinner. the flags come from the local data file rather than the API, because this is what shows while the API request is still going. localData.js is in the restcountries format, which is why the name is read as name.common here
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

    return (
        <div className="loading">
            {/* giving it a key that changes makes React swap in a brand new img each time, so a flag that fails to load can't leave the old one showing */}
            <img
                key={current.png}
                src={current.png}
                alt={current.name}
                onError={(e) => {
                    if (current.svg) e.currentTarget.src = current.svg;
                }}
                className="loadingFlag"
            />
            <h2>Loading...</h2>
        </div>
    );
}

export default Loading;
