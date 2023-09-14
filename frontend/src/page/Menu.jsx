import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AllProduct from "../component/AllProduct";

const Menu = () => {
  const { filterby } = useParams();
  const productData = useSelector((state) => state.product.productList);

  const productDisplay = productData.filter((el) => el._id === filterby)[0];
  console.log(productDisplay);
  return (
    <div className="p-2 md:p-4">
      <div className="w-30  max-w-4xl m-auto md:flex bg-white">
        <div className="max-w-sm  overflow-hidden w-full p-5">
          <img
            src={productDisplay.image}
            className="hover:scale-105 transition-all h-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-slate-600  capitalize text-2xl md:text-4xl">
            {productDisplay.brand}
          </h3>
          <p className=" text-slate-500  font-medium text-2xl">
            {productDisplay.model}
          </p>
          <p className=" font-bold md:text-2xl">
            <span className="text-red-500 ">₹</span>
            <span>{productDisplay.price}</span>
          </p>
          <div className="flex gap-3">
            <button className="bg-yellow-500 py-1 mt-2 rounded hover:bg-yellow-600 min-w-[100px]">
              Add Cart
            </button>
          </div>
        </div>
      </div>
      <AllProduct heading={"Your Product"} />
    </div>
  );
};

export default Menu;
