import React from "react";
import homeimg1 from "../assest/homeimg1.png";

const Home = () => {
  return (
    <div className="p-2 md:p-4">
      <div className="md:flex gap-4 py-2">
        <div className="md:w-1/2">
          <div className="flex gap-3 bg-slate-300 w-36 px-1 items-center rounded-full">
            <p className="text-sm font-medium text-slate-900">Football </p>
            <img src={homeimg1} className="h-8" />
          </div>
        </div>
        <div className="text-4xl md:text-7xl font-bold py-3">
          <h2 className="text-4xl md:text-7xl font-bold py-3">
            Best of the futer in{" "}
            <span className="text-blue-600 text-"> Your goal</span>
          </h2>
        </div>
        <div className="md:w-1/2">
          <div>imge1</div>
          <div>img2</div>
          <div>img3</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
