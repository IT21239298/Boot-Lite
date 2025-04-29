import React, { useState } from "react";
import loginSignupImage from "../assest/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  // Add validation states
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((preve) => !preve);
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    // At least 6 characters, with at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  // Validate name fields (no numbers or special characters)
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
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

  const handleUploadProfileImage = async (e) => {
    try {
      const data = await ImagetoBase64(e.target.files[0]);

      setData((preve) => {
        return {
          ...preve,
          image: data,
        };
      });
      
      // Clear any image error
      setErrors(prev => ({
        ...prev,
        image: ""
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        image: "Failed to upload image. Please try again."
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      firstName: "", 
      lastName: "", 
      email: "", 
      password: "", 
      confirmPassword: "",
      image: ""
    };

    // Validate first name
    if (!data.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    } else if (!validateName(data.firstName)) {
      newErrors.firstName = "First name should contain only letters";
      valid = false;
    }

    // Last name is optional but if provided, should be valid
    if (data.lastName && !validateName(data.lastName)) {
      newErrors.lastName = "Last name should contain only letters";
      valid = false;
    }

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
      newErrors.password = "Password must be at least 6 characters with at least one letter and one number";
      valid = false;
    }

    // Validate confirm password
    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation before submission
    if (!validateForm()) {
      // Instead of a generic toast, scroll to the first error
      const firstErrorField = Object.keys(errors).find(key => errors[key] !== "");
      if (firstErrorField && document.getElementById(firstErrorField)) {
        document.getElementById(firstErrorField).scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(firstErrorField).focus();
      }
      return;
    }
    
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/signup`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const dataRes = await fetchData.json();
      toast(dataRes.message);
      if (dataRes.alert) {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4">
        <h2 className="font-bold text-2xl text-slate-800 mb-4 text-center">
          Create An Account
        </h2>
        <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
          <img
            src={data.image ? data.image : loginSignupImage}
            className="w-full h-full"
            alt="Profile"
          />

          <label htmlFor="profileImage">
            <div className="absolute bottom-0 h-1/3 bg-slate-500 bg-opacity-50 w-full text-center cursor-pointer">
              <p className="text-sm p-1 text-white">Upload</p>
            </div>
            <input
              type={"file"}
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleUploadProfileImage}
            />
          </label>
        </div>
        {errors.image && (
          <p className="text-red-500 text-xs text-center mt-1">{errors.image}</p>
        )}

        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name<span className="text-red-500">*</span></label>
          <input
            type={"text"}
            id="firstName"
            name="firstName"
            className={`mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 ${
              errors.firstName ? "border-2 border-red-500" : ""
            }`}
            value={data.firstName}
            onChange={handleOnChange}
            onBlur={() => {
              if (!data.firstName.trim()) {
                setErrors(prev => ({
                  ...prev,
                  firstName: "First name is required"
                }));
              } else if (!validateName(data.firstName)) {
                setErrors(prev => ({
                  ...prev,
                  firstName: "First name should contain only letters"
                }));
              }
            }}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mb-2">{errors.firstName}</p>
          )}

          <label htmlFor="lastName">Last Name<span className="text-red-500">*</span></label>
          <input
            type={"text"}
            id="lastName"
            name="lastName"
            className={`mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 ${
              errors.lastName ? "border-2 border-red-500" : ""
            }`}
            value={data.lastName}
            onChange={handleOnChange}
            onBlur={() => {
              if (!data.lastName.trim()) {
                setErrors(prev => ({
                  ...prev,
                  lastName: "Last name is required"
                }));
              } else if (!validateName(data.lastName)) {
                setErrors(prev => ({
                  ...prev,
                  lastName: "Last name should contain only letters"
                }));
              }
            }}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mb-2">{errors.lastName}</p>
          )}

          <label htmlFor="email">Email<span className="text-red-500">*</span></label>
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
              if (!data.email) {
                setErrors(prev => ({
                  ...prev,
                  email: "Email is required"
                }));
              } else if (!validateEmail(data.email)) {
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

          <label htmlFor="password">Password<span className="text-red-500">*</span></label>
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
                if (!data.password) {
                  setErrors(prev => ({
                    ...prev,
                    password: "Password is required"
                  }));
                } else if (!validatePassword(data.password)) {
                  setErrors(prev => ({
                    ...prev,
                    password: "Password must be at least 6 characters with at least one letter and one number"
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

          <label htmlFor="confirmpassword">Confirm Password<span className="text-red-500">*</span></label>
          <div className={`flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300 ${
            errors.confirmPassword ? "border-2 border-red-500" : ""
          }`}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmPassword"
              className="w-full bg-slate-200 border-none outline-none"
              value={data.confirmPassword}
              onChange={handleOnChange}
              onBlur={() => {
                if (!data.confirmPassword) {
                  setErrors(prev => ({
                    ...prev,
                    confirmPassword: "Please confirm your password"
                  }));
                } else if (data.password !== data.confirmPassword) {
                  setErrors(prev => ({
                    ...prev,
                    confirmPassword: "Passwords do not match"
                  }));
                }
              }}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleShowConfirmPassword}
            >
              {showConfirmPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mb-2">{errors.confirmPassword}</p>
          )}

          <button className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4">
            Sign up
          </button>
        </form>
        <p className="text-left text-sm mt-2">
          Already have account?{" "}
          <Link to={"/login"} className="text-red-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;