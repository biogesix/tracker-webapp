import { useState } from "react";
import logo from "../assets/logosample1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsProgress,
  faXmark,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/UserContext";

const navLinks = [
  {
    name: "Home",
    path: "/dashboard",
  },
  {
    name: "Profile",
    path: "/profile",
  },
  {
    name: "Weekly Summaries",
    path: "/weeklysummaries",
  },
  {
    name: "Saved Expenses",
    path: "/saved",
  },
  {
    name: "About Us",
    path: "/about",
  },
];

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/auth");
  };

  return (
    <div>
      <header className="flex justify-between items-center text-black px-16 bg-vanilla drop-shadow-md h-16">
        <button onClick={toggleMenu} className="text-2xl">
          <FontAwesomeIcon icon={faBarsProgress} />
        </button>
      </header>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform flex-col px-8 py-2 flex z-10 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-4">
          <img
            src={logo}
            alt="Logo"
            onClick={() => console.log("Home button clicked")}
            className="h-20 w-20 cursor-pointer"
          />
          <button onClick={toggleMenu} className="text-2xl">
            <FontAwesomeIcon icon={faXmark} color="black" />
          </button>
        </div>

        <nav className="flex flex-col items-start p-6 text-black">
          {navLinks.map(({ name, path }) => (
            <button
              className="py-2 px-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <Link to={path}> {name} </Link>
            </button>
          ))}
        </nav>

        <button
          onClick={logOut}
          className="absolute bottom-4 right-4 gap-2 flex items-center text-black hover:text-red-600"
        >
          <FontAwesomeIcon icon={faSignOutAlt} size={"lg"} /> Log Out
        </button>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

export default Sidebar;
