import { Link, NavLink, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex px-[5%] py-4 justify-between items-center w-full border-b fixed">
      <div>
        <Link to="/">
          <span className="antialiased font-bold text-2xl">
            MicroservicesTest
          </span>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="pr-20">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "mx-3 transition-all",
                isActive ? "border-b border-b-white" : "border-b-0",
              ].join(" ")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [
                "mx-3 transition-all",
                isActive ? "border-b border-b-white" : "border-b-0",
              ].join(" ")
            }
          >
            Dashboard
          </NavLink>
        </div>

        <Button className="mr-4" onClick={() => navigate("/signin")}>
          Sign In
        </Button>

        <ModeToggle />
      </div>
    </nav>
  );
};
