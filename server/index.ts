//Author: Sami Chamberlain
//Initially Created: Sep. 2024.
//Recreated: Mar. 2026.

const __dirname = import.meta.dirname;

import "dotenv/config";
import express from "express";

import path from "path";
import cors from "cors";

import * as PokeAPI from "./pokeAPI.ts";
import { RecurrenceRule, scheduleJob } from "node-schedule";

//postgresql setup
import { Pool } from "pg";

const app = express();

app.use(cors());
app.use("/pokemon-wordle", express.static("build"));

//Innstantiate pg database pool
const pool = new Pool({
  host: "localhost",
  port: parseInt(process.env.POSTGRES_PORT as string),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

//queries database for the currently active pokemon of the day.
async function getActivePokemon() {
  try {
    const pokemonData = await pool.query(
      `
          SELECT * FROM pokemon
          WHERE pokemon.date = CURRENT_DATE
          ORDER BY id DESC
          LIMIT 1
          `,
    );

    if (pokemonData.rowCount && pokemonData?.rowCount > 0) {
      return pokemonData.rows[0];
    } else return undefined;
  } catch (error) {
    console.error(
      "[Pokemon Wordle // getActivePokemon] :: Error getting collections from pokemon database! : ",
      error,
    );
  }
}

//cron job to update the pokemon of the day.
async function updatePkmnOfDay() {
  //Check if the pokemon of the day exists. If so, skip this.
  const activePokemon = await getActivePokemon();
  if (activePokemon) {
    console.log(
      "[Pokemon Wordle // updatePkmnOfDay] :: Pokemon of day already exists. Skipping....",
    );
    return;
  }

  try {
    let pokemon = await PokeAPI.generatePokemon();

    pool.query(
      `
          INSERT INTO pokemon(pokedexNum, pokedexEntry, name, class, cry, sprite, types, height, weight)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
      [
        pokemon.pokedexNum, // number
        pokemon.pokedex, //string
        pokemon.name, //string
        pokemon.classification, //string
        pokemon.cry, //string
        pokemon.sprite, //string
        pokemon.types, // string[]
        pokemon.height, //string
        pokemon.weight, // string
      ],
    );

    console.log(
      `[Pokemon Wordle // updatePkmnOfDay] :: updating pokemon of the day to ${pokemon.name}!`,
    );
  } catch (error) {
    console.error(
      "[Pokemon Wordle // updatePkmnOfDay] :: Error updating pokemon of the day! : ",
      error,
    );
  }
}

app.get("/pokemon-wordle/api/pokemon-of-day", (req, res) => {
  //gets pokemon data from arangoDB, logs it.
  try {
    getActivePokemon().then((dat) => {
      res.json(dat);
    });
  } catch (err) {
    res.json(err).status(500);
  }
});

const rule = new RecurrenceRule();
rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
rule.tz = "America/New_York";

const resetRule = new RecurrenceRule();
resetRule.hour = 0;
resetRule.minute = 0;
resetRule.second = 0;
resetRule.tz = "America/New_York";

scheduleJob(rule, async () => {
  //try to get the active pokemon...
  const pokemonOfDay = await getActivePokemon();

  //if it doesn't exist, create a new one!
  if (!pokemonOfDay) {
    updatePkmnOfDay();
  }
});

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
  });
}

//GET react SPA.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(
    `[Pokemon Wordle // Start] :: SERVER STARTED ON PORT ${process.env.PORT}`,
  );
  updatePkmnOfDay();
});
