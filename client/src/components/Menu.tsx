import { useEffect, useMemo, useState } from "react";

import "../../styles/Menu.css";
import Button from "./Button";

import { convertMsToTime } from "../utils";
import dayjs from "dayjs";

import dayjsUTC from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(dayjsUTC);
dayjs.extend(timezone);

interface Props {
  onStart: () => void;
}

const Menu = (props: Props) => {
  const [time, setTime] = useState<number>(0.0);

  useEffect(() => {
    const TZ = "America/New_York";
    const now = dayjs().tz(TZ);

    const midnightNextDay = now.add(1, "day").startOf("day");
    const diffMs = midnightNextDay.diff(now);

    setTime(diffMs);
  }, []);

  //memoize the interval function so it only updates once
  //at the beginning of the render.
  useMemo(() => {
    setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1000, 0));
    }, 1000);
  }, []);

  return (
    <>
      <div className="panel" id="menu">
        <div className="title">
          <h1 className="title-text">Pokemon Wordle Prototype</h1>
          <h2 className="title-subtext">Created by Sami Chamberlain</h2>
        </div>

        <Button
          link=""
          onclick={() => {
            props.onStart();
          }}
        >
          Start
        </Button>
        <h3 className="menu-footer">
          Time to next Pokemon: {convertMsToTime(time)}
        </h3>
      </div>
    </>
  );
};

export default Menu;
