// the Express server behind the app, with three tables: users for the profile form, saved_countries for the heart button, and country_counts for the detail page views. it only stores country names and not the country data itself, because the frontend already has the full list from the countries API. every route is set up the same way, a function that does the database bit wrapped in handleErrors
import express from "express";
import pg from "pg";
import config from "./config.js";

const app = express();
const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// a Pool instead of a single Client so each request gets its own connection
const db = new pg.Pool({
  connectionString: config.databaseUrl,
});

// without this, a dropped/idle connection error crashes the whole server
db.on("error", (error) => {
  console.error("Unexpected error on idle DB client:", error);
});

// turns the JSON sent from the frontend into req.body, without it every POST below would get undefined
app.use(express.json());

// every route fails the same way, so this wraps them instead of repeating the same try/catch six times
function handleErrors(routeHandler, errorMessage) {
  return async (req, res) => {
    try {
      await routeHandler(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).send(errorMessage);
    }
  };
}

// ---------- USERS ----------

async function getAllUsers() {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
}

app.get(
  "/get-all-users",
  handleErrors(async (req, res) => {
    res.json(await getAllUsers());
  }, "Error retrieving users."),
);

// newest user = highest user_id, so no timestamp column needed to sort on
async function getNewestUser() {
  const result = await db.query(
    "SELECT * FROM users ORDER BY user_id DESC LIMIT 1;",
  );
  return result.rows;
}

app.get(
  "/get-newest-user",
  handleErrors(async (req, res) => {
    res.json(await getNewestUser());
  }, "Error retrieving newest user."),
);

// using $1, $2 placeholders instead of putting the values straight into the string, so someone can't type SQL into the form and have it run. this only ever inserts, there's no update, because the app just reads whichever row is newest
async function addOneUser(name, countryName, email, bio) {
  await db.query(
    `INSERT INTO users (name, country_name, email, bio)
    VALUES ($1, $2, $3, $4);`,
    [name, countryName, email, bio],
  );
}

app.post(
  "/add-one-user",
  handleErrors(async (req, res) => {
    const { name, country_name, email, bio } = req.body;
    await addOneUser(name, country_name, email, bio);
    res.send("Success! User has been added.");
  }, "Error adding user."),
);

// ---------- SAVED COUNTRIES ----------

// only the names, since the frontend already has the full country list to match them against
async function getAllSavedCountries() {
  const result = await db.query("SELECT country_name FROM saved_countries;");
  return result.rows;
}

app.get(
  "/get-all-saved-countries",
  handleErrors(async (req, res) => {
    res.json(await getAllSavedCountries());
  }, "Error retrieving saved countries."),
);

// country_name is UNIQUE, so saving the same country twice is not an option. ON CONFLICT DO NOTHING means it gets skipped quietly instead of erroring
async function saveOneCountry(countryName) {
  await db.query(
    `INSERT INTO saved_countries (country_name)
    VALUES ($1)
    ON CONFLICT (country_name) DO NOTHING;`,
    [countryName],
  );
}

app.post(
  "/save-one-country",
  handleErrors(async (req, res) => {
    await saveOneCountry(req.body.country_name);
    res.send("Success! The country is saved.");
  }, "Error saving country."),
);

async function unsaveOneCountry(countryName) {
  await db.query("DELETE FROM saved_countries WHERE country_name = $1;", [
    countryName,
  ]);
}

app.post(
  "/unsave-one-country",
  handleErrors(async (req, res) => {
    await unsaveOneCountry(req.body.country_name);
    res.send("Success! The country is unsaved.");
  }, "Error unsaving country."),
);

// ---------- COUNTRY COUNTS ----------

// upsert: start a new country at count 1, otherwise bump the existing count by 1. RETURNING sends the new count straight back, so the detail page doesn't need a second request
async function updateOneCountryCount(countryName) {
  const result = await db.query(
    `INSERT INTO country_counts (country_name, count)
     VALUES ($1, 1)
     ON CONFLICT (country_name)
     DO UPDATE SET count = country_counts.count + 1
     RETURNING country_name, count;`,
    [countryName],
  );
  return result.rows[0];
}

app.post(
  "/update-one-country-count",
  handleErrors(async (req, res) => {
    res.json(await updateOneCountryCount(req.body.country_name));
  }, "Error updating country count."),
);
