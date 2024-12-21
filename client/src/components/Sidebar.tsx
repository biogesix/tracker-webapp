import { useState } from "react";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsProgress,
  faXmark,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/UserContext";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { CircleUserRound } from "lucide-react";
import { User } from "@/utils/types";
import getUser from "@/utils/getUser";

const navLinks = [
  {
    name: "Home",
    path: "/dashboard",
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

  const queryClient = useQueryClient();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    nav("/auth");
  };

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: false,
  });

  return (
    <div className="z-20">
      <header className="flex h-16 w-full items-center justify-between bg-white/30 px-16 text-black shadow-md drop-shadow-md backdrop-blur-md">
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

        {/* profile */}
        <div className="flex h-[12rem] w-full flex-col items-center justify-center border-b-2 border-slate-300">
          <CircleUserRound className="mb-2 size-[4rem] stroke-1" />
          {user && (
            <>
              <text className="text-xl font-bold">{user?.username}</text>
              <text>{user?.email}</text>
            </>
          )}
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
          className="absolute bottom-16 left-1/2 mt-4 flex h-8 w-[8rem] -translate-x-1/2 transform items-center justify-center bg-gray-300 hover:bg-slate-200"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="size-[1.2rem]" />
          <text className="ml-2 text-sm">Log out</text>
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
