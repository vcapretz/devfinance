import classNames from "classnames";
import * as React from "react";

type CardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: "default" | "total";
};

export const Card: React.FC<Readonly<CardProps>> = ({
  title,
  value,
  icon,
  variant = "default",
}) => (
  <div
    className={classNames(
      {
        "bg-white text-cyan-900": variant === "default",
        "bg-green-500 text-white": variant === "total",
      },
      "py-6 px-8 rounded mg-8 "
    )}
  >
    <h3 className="font-normal text-lg flex items-center justify-between gap-1">
      <span>{title}</span>
      {icon}
    </h3>

    <p className="mt-4 text-3xl">{value}</p>
  </div>
);
