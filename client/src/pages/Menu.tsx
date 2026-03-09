//Author: Sami Chamberlain
//Purpose: Holds all logic for the Menu state of PokeWordle

import { useEffect, useState } from "react";

import { convertMsToTime } from "../utils";
import dayjs from "dayjs";

import dayjsUTC from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

dayjs.extend(dayjsUTC);
dayjs.extend(timezone);

const Menu = () => {
  const [time, setTime] = useState<number>(0.0);

  const nav = useNavigate();

  useEffect(() => {
    const TZ = "America/New_York";
    const now = dayjs().tz(TZ);

    const midnightNextDay = now.add(1, "day").startOf("day");
    const diffMs = midnightNextDay.diff(now);

    setTime(diffMs);
  }, []);

  //memoize the interval function so it only updates once
  //at the beginning of the render.

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center text-center">
      <div className="panel">
        <div className="top-screen ">
          <div className="title flex flex-col w-full h-full items-center justify-center gap-10">
            <h1 className="pokewordle-title text-[50pt] text-white  bg-[#00000055] rounded-full w-fit px-4">
              PokéWordle
            </h1>

            <h2 className=" relative text-[20pt] top-[45px] font-bold text-white  bg-[#00000055] rounded-full w-fit px-4">
              Made by Sami Chamberlain
            </h2>
          </div>
        </div>

        <div className="bottom-screen">
          <div className="relative h-full flex flex-col gap-2 items-center justify-center ">
            <div className="relative -top-7.5">
              <Button
                label="Start"
                onClick={() => {
                  nav("/pokemon-wordle/game");
                  //go to next state of the game...
                }}
              />
            </div>

            <h3 className="relative top-10 text-white underline text-xl font-bold">
              Time to next Pokémon: {convertMsToTime(time)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
