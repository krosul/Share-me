import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";

import logo from "../assets/assets/logo.png";
import { categories } from "../utils/data";
const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize dark:hover:text-white";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize dark:text-white dark:border-white";

const SideBar = ({ user, closeToggle }) => {
  const [Theme, setTheme] = useState(localStorage.getItem('theme'));
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  useEffect(() => {
    
    if (Theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [Theme]);

  const handleChangeTheme = (e) => {
    localStorage.setItem('theme',Theme === "dark" ? "light" : "dark")
    setTheme(Theme === "dark" ? "light" : "dark");
  };
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hidde-scrollbar transition-colors duration-700 dark:bg-darkMode">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            home
          </NavLink>
          <h3 className="mt-3 px-5 text-base 2xl:text-xl dark:text-white">
            Discover categorys
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              onClick={handleCloseSidebar}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              key={category.name}
            >
              <img
                src={category.image}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      <span className="flex justify-center items-center">
        <input
          type="checkbox"
          onClick={(e) => handleChangeTheme(e)}
          className=" w-8 h-8 z-10 opacity-0 absolute"
        />
        <svg className=" h-12 w-12 dark:fill-white" viewBox="0 0 48 48">
          <path d="M0 0h48v48h-48z" fill="none"></path>
          <path d="M40 17.37v-9.37h-9.37l-6.63-6.63-6.63 6.63h-9.37v9.37l-6.63 6.63 6.63 6.63v9.37h9.37l6.63 6.63 6.63-6.63h9.37v-9.37l6.63-6.63-6.63-6.63zm-16 18.63c-1.79 0-3.48-.4-5-1.1 4.13-1.9 7-6.06 7-10.9s-2.87-9-7-10.9c1.52-.7 3.21-1.1 5-1.1 6.63 0 12 5.37 12 12s-5.37 12-12 12z"></path>
        </svg>
      </span>
      {user && (
        <Link
          to={`/user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 items-center bg-white rounded-lg shadow-lg mx-3 dark:bg-transparent dark:text-white dark:font-semibold"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-full"
            alt="perfil"
          />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default SideBar;
