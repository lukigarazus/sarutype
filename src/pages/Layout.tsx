import { ComponentType, PropsWithChildren } from "react";
import { BsFillKeyboardFill } from "react-icons/bs";
import { BiSolidCog } from "react-icons/bi";
import { IoMdStats } from "react-icons/io";
import { useOptions } from "../hooks/useOptions";
import { Link } from "react-router-dom";

const navigationElements = [
  {
    name: "Test",
    icon: BsFillKeyboardFill,
    path: "/sarutype/",
    title: "Start a new test",
  },
  {
    name: "Stats",
    icon: IoMdStats,
    path: "/sarutype/stats",
    title: "Statistics",
  },
  {
    name: "Options",
    icon: BiSolidCog,
    path: "/sarutype/options",
    title: "Options",
  },
];

export const Layout: ComponentType<PropsWithChildren> = ({ children }) => {
  const { loading: optionsLoading } = useOptions();
  return (
    <>
      <header
        style={{
          height: "3em",
          padding: "0.5em",
          display: "flex",
        }}
      >
        <div
          style={{
            marginRight: "1em",
          }}
        >
          <span
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
            }}
          >
            Sarutype
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {navigationElements.map((element, index) => {
            const Icon = element.icon;
            return (
              <Link
                to={element.path}
                title={element.title}
                key={index}
                style={{
                  display: "inline-block",
                  padding: "0.5em",
                  fontSize: "1.5em",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <Icon />
              </Link>
            );
          })}
        </div>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "calc(100vh - 3em - 1em)",
        }}
      >
        {optionsLoading ? "Loading..." : children}
      </main>
    </>
  );
};
