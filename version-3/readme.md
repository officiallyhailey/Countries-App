# Countries App - Version 3 — Instructions

## 👋 Welcome!

Now it’s time to build your own backend from scratch! 

In this version, you'll:
- Set up a PostgreSQL database using **Neon.tech**
- Build a server using **Node.js** and **Express**
- Create API endpoints that handle HTTP requests to store and retrieve data

This version gives you real-world, hands-on experience designing and connecting your own backend services — a major milestone in full-stack development!

Coming up in Version 4, you’ll deploy your full-stack app to the web and see everything come together. 🚀

---

## 🎯 Requirements for Version 3

Build a working PostgreSQL database and Express API/server that allows your frontend to store and retrieve the following data:

1. **Form data**
    - As a user, when I submit the form, my data should be stored in a PostgreSQL database
    - If I’ve already submitted the form, I should see “Welcome, [my name]!” above the form on the Saved Countries page

2. **Saved Countries**
    - When I click the Save button on a country’s page, that country should be saved in the database
    - I should be able to view all saved countries on the Saved Countries page

3. **View Count**
    - Each time I open a country’s detail page, the view count for that country should increase by 1
    - I should be able to see the total number of times I’ve viewed each country

---

## 🔗 Resources

- **API Documentation**  
  Build your Countries API according to the `api-documentation.md` file. 

---

## 🚀 Roadmap: Step-by-step guide to building Version 3

---

### 🎯 Milestone: SQL Database Schema
1. Write PostgreSQL code to:
   a. Create 3 tables: `users`, `saved_countries`, and `country_counts`
   b. Insert at least 3 rows of sample data into each table
   c. Write SQL queries your API will need to:
        - Store and retrieve Form data
        - Store and retrieve Saved Countries data
        - Store and retrieve Country Count data

---

### 🎯 Milestone: Deploy Database to Neon
1. Follow [this Neon deployment guide](https://github.com/ac-backend/countries-app-instructions/blob/main/version-3/connect-neon-database-to-express-server.md) to help you do the following:
  - Create a new database
  - Set up your schema (create the 3 tables and insert rows of sample data)
  - Confirm that the data was inserted successfully

---

### ⚙️ Create your `version-3` folder

1. Open your `countries-app` folder in VS Code. 
2. In your root `countries-app` folder, create a new folder called `version-3`.
3. Inside `version-3`, create two folders:
   - `client` — for your frontend code
   - `server` — for your backend (API) code

---

### 📝 Pseudo-Code your API/Server

1. In your `version-3` folder, create a file called `pseudo-code.txt`.
2. Open the following link and copy all of its contents into your `pseudo-code.txt` file:  
https://github.com/ac-backend/countries-app-instructions/blob/main/version-3/pseudo-code.txt
3. Locate your Countries App DB Fiddle. You will use it as a reference for this task.
4. Complete the pseudo-code file by filling in all blanks according to the instructions.
   Your goal is to map the SQL queries you already wrote to the API endpoints you will build.
   
---

### ⚙️ Copy your frontend code into `version-3`

1. Copy all files from your `version-2` folder.
2. Paste them into the `client` folder inside `version-3`.

Your `client` folder now contains your Version 3 frontend.

---

### ⚙️ Set up your `server` folder

Next, you’ll initialize your backend server.

Your `server` folder will eventually include:
- `package.json` — lists project info and dependencies  
- `.gitignore` — list of files Git should ignore  
- `src/` — your app's custom code lives in this folder
- `src/index.js` — your server/API code  
- `src/config.js` — your database configuration & password
- `node_modules/` — installed project dependencies (auto-generated)  
- `package-lock.json` — lists the locked dependency versions (auto-generated)

#### Steps

1. Open the `server` folder in your terminal.
2. In the `server` folder, run `npm init -y` to generate a `package.json` file. Add `"type": "module"` as a property to the object in this file.
3. In the `server` folder, create a `.gitignore` file. In this file, list `node_modules` and `config.js`, like this:

    <img width="300" alt="Screenshot of a .gitignore file" src="https://github.com/user-attachments/assets/2907cf5e-00c0-472a-8f49-2debd521a91b" />

4. In the `server` folder, create a `src` folder.
5. Inside the `src` folder, create an `index.js` file and a `config.js` file.
6. In `config.js`, add the following code and replace `REPLACE_ME` with your Neon database connection string:

    ```js
    const config = {
      databaseUrl:
        "REPLACE_ME",
    };
    
    export default config;
    ```

    If you get stuck, use this guide:
    [How to connect your Neon Database to your Local Express server](https://github.com/ac-backend/countries-app-instructions/blob/main/version-3/connect-neon-database-to-express-server.md)

--- 

### ⚙️ Install dependencies

1. In VS Code, open the terminal and `cd` into your `server` folder in the `version-3` folder
2. In the `server` folder, install the `express` and `pg` packages by running these commands:
    - `npm install express`
    - `npm install pg`
3. Confirm the packages installed successfully
    - `express` and `pg` appear in `package.json` under `dependencies`
    - A `node_modules` folder was created
  
--- 

### ✅ Check your setup

This is what your `client` folder should look like:

<img width="300" alt="Screenshot of client folder structure" src="https://github.com/user-attachments/assets/c9f4de98-0414-44ca-be4e-1b05da0a77b2" />


This is what your `server` folder should look like:

<img width="300" alt="Sreenshot of server folder structure" src="https://github.com/user-attachments/assets/9785ecfd-7634-4669-9b91-10d68e074f6d" />


---

### ⚙️ Connect your Neon-hosted PostgreSQL database to your Express server
1. [Follow this guide to connect your Neon database to your Express server](https://github.com/ac-backend/countries-app-instructions/blob/main/version-3/connect-neon-database-to-express-server.md).

---

### ⚙️ Connect your frontend to your backend
1. In your `client` folder in the `version-3` folder, locate your `vite.config.js` file. 
2. Update your `vite.config.js` file so that it fetches data from `http://localhost:3000/` as the base URL

---

### ⚙️ Set up your server's boilerplate code 
1. In your server's `index.js` file, set up your server using the same boilerplate code as the Animals API `node-7-express-sql` project. 

---

### 🔷 Build API Endpoints for Form data
- `POST /add-one-user`: Save submitted form data
- `GET /get-newest-user`: Return the form data if it exists
- Test your API endpoints in Postman to make sure they're working
- Test your API endpoints with your frontend

---

### 🔷 Build API Endpoints for Saved Countries
- `POST /save-one-country`: Save a country
- `GET /get-all-saved-countries`: Return all saved countries
- Test your API endpoints in Postman to make sure they're working
- Test your API endpoints with your frontend

---

### 🔷 Build API Endpoint for Country Count
- `POST /update-one-country-count`: Increment the view count
- Test your API endpoint in Postman to make sure they're working
- Test your API endpoints with your frontend

---

### Test everything again... and again! 
1. Test all user flows: submitting the form, saving a country, viewing a country’s view count
2. Check your database to make sure the data is updating correctly

---

### Clean and Comment your code
1. Refactor your backend code to make it clean and modular
2. Comment complex logic to explain how it works

---

### Deploy & Submit
1. Push your code to Github
2. Submit to Canvas!

---

## 🌟 Stretch Goals (Optional)

Finished the main requirements? Here are some bonus challenges:

- 🏆 Add an `/unsave-one-country` API endpoint to unsave a single country
- 🏆 Add an `/unsave-all-countries` API endpoint to unsave all countries
- 🏆 Add a `/reset-one-country-count` API endpoint to reset a country's count back to 0 
