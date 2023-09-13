import React from "react";
import loginSignupImage from "../assest/login-animation.gif";

const Signup = () => {
  return (
    <div>
      <div className="p-3 md:p-4">
        <div className="w-full max-w-sm bg-white m-auto"></div>
        {/*<h1>Sign Up</h1>*/}
        <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative ">
          <img src={loginSignupImage} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
