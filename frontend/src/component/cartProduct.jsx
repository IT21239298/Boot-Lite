import React from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { increaseQty, decreaseQty, deleteCartItem } from "../redux/cartSlice";
import { toast } from "react-hot-toast"; // Import toast

const CartProduct = ({ id, image, model, brand, price, qty, total }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.cart.loading);
  const userData = useSelector((state) => state.user);
  const isLoggedIn = !!userData._id;

  // Handle quantity increment
  const handleIncrement = () => {
    if (!isLoggedIn) {
      toast.error("Please login to modify cart");
      return;
    }
    dispatch(increaseQty(id));
  };

  // Handle quantity decrement
  const handleDecrement = () => {
    if (!isLoggedIn) {
      toast.error("Please login to modify cart");
      return;
    }
    if (parseInt(qty) > 1) {
      dispatch(decreaseQty(id));
    }
  };

  // Handle item removal
  const handleRemove = () => {
    if (!isLoggedIn) {
      toast.error("Please login to modify cart");
      return;
    }
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="bg-slate-200 p-2 flex gap-4 rounded border border-slate-300 my-2">
      <div className="p-3 bg-white rounded overflow-hidden">
        <img src={image} className="h-28 w-36 object-cover" alt={model} />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <h3 className="font-semibold text-slate-600 capitalize text-lg md:text-xl">
            {model}
          </h3>
          <div className="cursor-pointer text-slate-700 hover:text-red-500" onClick={handleRemove}>
            <FaTrash />
          </div>
        </div>
        <p className="text-slate-500 font-medium">{brand}</p>
        <p className="font-bold text-base">
          <span className="text-red-500">₹</span>
          <span>{price}</span>
        </p>
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <button
              onClick={handleDecrement}
              className="bg-slate-300 py-1 rounded hover:bg-slate-400 p-1 disabled:opacity-50"
              disabled={loading || parseInt(qty) <= 1}
            >
              <FaMinus />
            </button>
            <p className="font-semibold p-1">{qty}</p>
            <button
              onClick={handleIncrement}
              className="bg-slate-300 py-1 rounded hover:bg-slate-400 p-1 disabled:opacity-50"
              disabled={loading}
            >
              <FaPlus />
            </button>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <p>Total :</p>
            <p>
              <span className="text-red-500">₹</span>
              {total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;