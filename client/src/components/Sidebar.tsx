import { useState } from "react";
import logo from "../assets/logosample1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsProgress,
  faXmark,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";
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
    <div className="z-20">
      <header className="bg-vanilla flex h-16 w-full items-center justify-between px-16 text-black drop-shadow-md">
        <button onClick={toggleMenu} className="text-2xl">
          <FontAwesomeIcon icon={faBarsProgress} />
        </button>
      </header>

      <div
        className={`fixed left-0 top-0 z-10 flex h-full transform flex-col bg-white px-8 py-2 shadow-lg transition-transform ${
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
          {navLinks.map(({ name, path }, idx) => (
            <Link
              to={path}
              className="w-full rounded-md text-lg font-semibold hover:bg-gray-200"
              key={idx}
            >
              <button
                className="w-full p-2"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {name}
              </button>
            </Link>
          ))}
        </nav>

        <button
          onClick={logOut}
          className="absolute bottom-4 right-4 text-2xl text-black hover:text-red-600"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>

      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50"
        />
      )}
    </div>
  );
};

export default Sidebar;
