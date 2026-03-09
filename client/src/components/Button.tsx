//Author: Sami Chamberlain
//Purpose: Helper function for buttons

import { MouseEventHandler } from "react";

interface ButtonProps {
  label?: string;
  displayType?: string;
  onClick?: MouseEventHandler;
}

const Button = (props: ButtonProps) => {
  return (
    <div
      className="retro-button border-2 border-black px-10 cursor-pointer text-[20pt] rounded-md "
      onClick={(e) => {
        props.onClick?.(e);
      }}
    >
      <button
        type="submit"
        className={
          "w-full text-center p-1 text-white font-pokemonPixel pointer-events-none"
        }
      >
        {props.label}
      </button>
    </div>
  );
};

export default Button;
