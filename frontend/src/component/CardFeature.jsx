import React from "react";

const CardFeature = ({ model, brand, image, price }) => {
  return (
    <div className="w-full min-w-[200px] max-w-[200px] bg-white hover:shadow-lg drop-shadow-lg py-5 px-4 cursor-pointer flex flex-col ">
      <div className="h-28 flex flex-col justify-center items-center ">
        <img src={image} className="h-full" />
      </div>
      <h3 className="font-semibold text-slate-600  capitalize text-lg mt-4">
        {brand}
      </h3>
      <p className=" text-slate-500  font-medium">{model}</p>
      <p className=" font-bold">
        <span className="text-red-500">$</span>
        <span>{price}</span>
      </p>
      <button className="bg-blue-500 py-1 mt-2 rounded hover:bg-blue-600 w-full">
        Add Cart
      </button>
    </div>
  );
};

export default CardFeature;
