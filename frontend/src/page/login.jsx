import React, { useState } from "react";
import loginSignupImage from "../assest/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginRedux } from "../redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  
  // Add validation states
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const userData = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password (minimum 6 characters)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });

    // Clear errors when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Validate email
    if (!data.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Validate password
    if (!data.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!validatePassword(data.password)) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation before submission
    if (!validateForm()) {
      return;
    }
    
    const { email, password } = data;
    if (email && password) {
      try {
        const fetchData = await fetch(
          `${process.env.REACT_APP_SERVER_DOMIN}/login`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const dataRes = await fetchData.json();
        console.log(dataRes);

        toast(dataRes.message);

        if (dataRes.alert) {
          dispatch(loginRedux(dataRes));
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }

        console.log(userData);
      } catch (error) {
        toast.error("Login failed. Please try again.");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4">
        <h2 className="font-bold text-2xl text-slate-800 mb-4 text-center">
          Login to Your Account
        </h2>
        <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto">
          <img src={loginSignupImage} className="w-full" alt="addimage" />
        </div>

        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type={"email"}
            id="email"
            name="email"
            className={`mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 ${
              errors.email ? "border-2 border-red-500" : ""
            }`}
            value={data.email}
            onChange={handleOnChange}
            onBlur={() => {
              if (data.email && !validateEmail(data.email)) {
                setErrors(prev => ({
                  ...prev,
                  email: "Please enter a valid email address"
                }));
              }
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-2">{errors.email}</p>
          )}

          <label htmlFor="password">Password</label>
          <div className={`flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300 ${
            errors.password ? "border-2 border-red-500" : ""
          }`}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="w-full bg-slate-200 border-none outline-none"
              value={data.password}
              onChange={handleOnChange}
              onBlur={() => {
                if (data.password && !validatePassword(data.password)) {
                  setErrors(prev => ({
                    ...prev,
                    password: "Password must be at least 6 characters"
                  }));
                }
              }}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mb-2">{errors.password}</p>
          )}

          <button 
            className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-left text-sm mt-2">
          Don't have account?{" "}
          <Link to={"/signup"} className="text-red-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;