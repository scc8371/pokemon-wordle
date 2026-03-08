require("dotenv").config();

const express = require("express");
const https = require("https");
const fs = require("fs");
//Author: Sami Chamberlain
//Initially Created: Sep. 2024.
//Recreated: Mar. 2026.

const __dirname = import.meta.dirname;

import "dotenv/config";
import express from "express";

import path from "path";
import cors from "cors";

import { Database, aql } from "arangojs";
import * as PokeAPI from "./pokeapi/pokeAPI.ts";
import { RecurrenceRule, scheduleJob } from "node-schedule";

const app = express();

app.use(cors());
app.use("/pokemon-wordle", express.static("build"));

//Initialize arangodb instance...
const db = new Database({
    url: process.env.ARANGO_URL as string,
    databaseName: process.env.ARANGO_DB as string,
    auth: {
        username: process.env.ARANGO_USER as string,
        password: process.env.ARANGO_PASS as string,
    },
});

//queries database for the currently active pokemon of the day.
async function getActivePokemon() {
    try {
        const cursor = await db.query({
            query: `FOR p IN pkmn
                      FILTER p.date == "${getDate()}"
                      RETURN p`,
            bindVars: {},
        });
        let pokemon = await cursor.all();

        if (pokemon.length) {
            return pokemon[pokemon.length - 1];
        } else {
            throw new Error("Pokemon of the Day not found!");
        }
    } catch (error) {
        console.error(
            "[Pokemon Wordle // getActivePokemon] :: Error getting collections from pokemon database! : ",
            error,
        );
    }
}

//cron job to update the pokemon of the day.
async function updatePkmnOfDay() {
    try {
        let pokemon = await PokeAPI.generatePokemon();

        db.query(
            aql`
            INSERT {
                pokedexNum: ${pokemon.pokedexNum},
                pokedexEntry: ${pokemon.pokedex},

                name: ${pokemon.name},
                class: ${pokemon.classification},

                cry: ${pokemon.cry},
                sprite: ${pokemon.sprite},
                types: ${pokemon.types},

                height: ${pokemon.height},
                weight: ${pokemon.weight},

                date: ${getDate()}
            } INTO pkmn
            `,
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

app.get("/pokemon-wordle/api", (req, res) => {
    //gets pokemon data from arangoDB, logs it.
    try {
        getActivePokemon().then((dat) => {
            res.json(dat);
        });
    } catch (err) {
        res.json(err).status(500);
    }
});

//This is also probably overkill...
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
    console.log(`SERVER STARTED ON PORT ${process.env.PORT}`);
    updatePkmnOfDay();
});


const app = express();

const pkmnAPI = new PokeAPI();

let pkmnOfDayExists = false;

    auth: {
      username: process.env.ARANGO_USER,
      password: process.env.ARANGO_PASS,
    },
  });

  try {
    const cursor = await db.query(aql`for p in pkmn
                                        filter p.date == ${getDate()}
                                        return p`);
    let entries = cursor.all();
    return entries;
  } catch (error) {
    console.error("Error getting collections from pokemon database! : ", error);
  }
}

async function updatePkmnOfDay() {

    auth: {
      username: process.env.ARANGO_USER,
      password: process.env.ARANGO_PASS,
    },
  });

  try {
    let pokemon = (await pkmnAPI.generatePokemon(1)).at(0);

    await db
      .query(
        aql`
            insert {
                pokedexNum: ${pokemon.pokedex_num},
                name: ${pokemon.name},
                height: ${pokemon.physical.height},
                weight: ${pokemon.physical.weight},
                class: ${pokemon.special_questions.classification},
                cry: ${pokemon.cry},
                sprite: ${pokemon.image},
                types: ${pokemon.general.types},
                pokedexEntry: ${pokemon.special_questions.pokedex_info},
                date: ${getDate()}
            } into pkmn
            `,
      )
      .then(
        console.log(`[SERVER] updating pokemon of the day to ${pokemon.name}!`),
      )
      .then((pkmnOfDayExists = true));
  } catch (error) {
    console.error("Error updating pokemon of the day! : ", error);
  }
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept",
  );
  next();
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app,
);

sslServer.listen(process.env.PORT, () => {
  console.log(`[SECURE SERVER] SERVER STARTED ON PORT ${process.env.PORT}`);
  pkmnOfDayExists = false;
});

let pkmnData = undefined;
app.get("/api", (req, res) => {
  //gets pokemon data from arangoDB, logs it.
  getActivePokemon().then((dat) => {
    pkmnData = dat;
    res.json(pkmnData);
  });
});

app.get("/time", (req, res) => {
  //return time in ms until reset.

  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const currentDate = new Date(now);
  const midnight = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
  );

  const timeToNextPuzzle = midnight.getTime() - currentDate.getTime();

  res.json(timeToNextPuzzle);
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
  if (!pkmnOfDayExists) {
    updatePkmnOfDay();
  }
});

scheduleJob(resetRule, () => {
  pkmnOfDayExists = false;
});

function getDate() {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
  });
}

async function pokemonOfDayExists() {
  let pkmnList = await getActivePokemon();
  pkmnOfDayExists = pkmnList.length > 0;
  return pkmnList.length > 0;
}
