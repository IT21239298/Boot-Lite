import React, { useState } from "react";
import logo from "../assest/logo.png";
import { Link } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";
import { BsFillCartCheckFill } from "react-icons/bs";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  //if click the profile button show login and menu
  const handleShowMenu = () => {
    setShowMenu((preve) => !preve);
  };

  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50">
      {/* desktop */}

      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className="h-10">
            <img src={logo} className="h-full" />
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={"home"}>Home</Link>
            <Link to={"menu"}>Menu</Link>
          </nav>
          <div className="text-2xl text-slate-600 relative">
            <BsFillCartCheckFill />
            <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center ">
              0
            </div>
          </div>
          <div className="text-2xl text-slate-600">
            <div className="text-3xl cursor-pointer" onClick={handleShowMenu}>
              <BiUserCircle />
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2  shadow drop-shadow-md flex flex-col min-w-[120px] text-center">
                <p className="whitespace-nowrap cursor-pointer px-2">
                  New product
                </p>
                <p className="whitespace-nowrap cursor-pointer px-2">Login</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile */}
    </header>
  );
};

export default Header;
