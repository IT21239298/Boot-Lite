import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../redux/cartSlice";
import { toast } from "react-hot-toast";

const CardFeature = ({ model, brand, image, price, loading, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const isLoggedIn = !!userData._id;

  const handleAddCartProduct = (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      // Optional: redirect to login page
      // navigate("/login");
      return;
    }
    
    dispatch(
      addCartItem({
        _id: id,
        model: model,
        brand: brand,
        image: image,
        price: price,
      })
    );
  };

  return (
    <div className="w-full min-w-[200px] max-w-[200px] bg-white hover:shadow-lg drop-shadow-lg py-5 px-4 cursor-pointer flex flex-col ">
      {image ? (
        <>
          <Link
            to={`/menu/${id}`}
            onClick={() => window.scrollTo({ top: "0", behavior: "smooth" })}
          >
            <div className="h-28 flex flex-col justify-center items-center ">
              <img src={image} className="h-full" alt={model} />
            </div>
            <h3 className="font-semibold text-slate-600 capitalize text-lg mt-4">
              {brand}
            </h3>
            <p className="text-slate-500 font-medium">{model}</p>
            <p className="font-bold">
              <span className="text-red-500">₹</span>
              <span>{price}</span>
            </p>
          </Link>
          <button
            className="bg-blue-500 py-1 mt-2 rounded hover:bg-blue-600 w-full text-white"
            onClick={handleAddCartProduct}
          >
            Add Cart
          </button>
        </>
      ) : (
        <div className="flex justify-center text-red-500 items-center h-full">
          <p>{loading}</p>
        </div>
      )}
    </div>
  );
};

export default CardFeature;