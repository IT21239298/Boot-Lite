import React, { useState } from "react";
import logo from "../assest/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";
import { FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";
import { MdAddCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BsFillCartCheckFill } from "react-icons/bs";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowMenu = () => {
    setShowMenu((preve) => !preve);
  };

  const handleLogout = () => {
    dispatch(logoutRedux());
    toast.success("Logout successfully");
    setShowMenu(false);
    navigate("/");
  };

  // Safely get cart items using optional chaining and fallback to empty array
  const cartItems = useSelector((state) => state.cart?.cartItem || []);
  
  // For backward compatibility - use product.cartItem if it exists
  const productCartItems = useSelector((state) => state.product?.cartItem || []);
  
  // Use whichever array has items, with fallback to 0
  const cartItemCount = cartItems.length || productCartItems.length || 0;

  // Check if user is logged in based on email existence
  const isLoggedIn = userData.email ? true : false;

  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-white">
      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className="h-10">
            <img src={logo} className="h-full" alt="logo" />
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={"/"} className="hover:text-blue-500 transition-colors">Home</Link>
          </nav>
          
          <div className="text-2xl text-slate-600 relative">
            <Link to={"cart"} className="hover:text-blue-500 transition-colors">
              <BsFillCartCheckFill />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center">
                  {cartItemCount}
                </div>
              )}
            </Link>
          </div>
          
          <div className="relative" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md flex items-center justify-center">
              {userData.image ? (
                <img
                  src={userData.image}
                  className="h-full w-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="text-slate-600 hover:text-blue-500 transition-colors">
                  <BiUserCircle />
                </div>
              )}
            </div>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg py-2 w-48 z-50 border border-gray-200">
                {/* User info section when logged in */}
                {isLoggedIn && (
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  </div>
                )}
                
                <div className="py-1">
                  {/* Admin option */}
                  {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                    <Link
                      to={"newproduct"}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setShowMenu(false)}
                    >
                      <MdAddCircle className="mr-2" />
                      New product
                    </Link>
                  )}
                  
                  {/* Logout/Login button */}
                  {isLoggedIn ? (
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to={"login"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowMenu(false)}
                      >
                        <FiLogIn className="mr-2" />
                        Login
                      </Link>
                      
                      <Link
                        to={"signup"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowMenu(false)}
                      >
                        <FiUserPlus className="mr-2" />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;