import { ReactNode } from "react";

export const Template = (props: { children?: ReactNode }) => {
  return (
    <div className="flex w-full h-screen  overflow-hidden">
      {props.children}
    </div>
  );
};
