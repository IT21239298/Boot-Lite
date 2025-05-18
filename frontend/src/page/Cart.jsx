import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartProduct from "../component/cartProduct";
import emptyCartImage from "../assest/empty.gif";
import { fetchCartItems, clearCart } from "../redux/cartSlice"; 
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItem, loading, error } = useSelector((state) => state.cart);
  const userData = useSelector((state) => state.user);
  const isLoggedIn = !!userData._id;

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isLoggedIn]);

  const totalPrice = cartItem?.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  ) || 0;
  
  const totalQty = cartItem?.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  ) || 0;

  const handleClearCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to modify cart");
      return;
    }
    
    dispatch(clearCart())
      .unwrap()
      .then(() => {
        toast.success("Cart cleared successfully");
      })
      .catch((error) => {
        toast.error("Failed to clear cart: " + error);
      });
  };

  if (loading && !cartItem.length) {
    return (
      <div className="p-2 md:p-4">
        <h2 className="text-center text-lg md:text-2xl font-bold text-slate-600">
          Loading Your Cart...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 md:p-4">
        <h2 className="text-center text-lg md:text-2xl font-bold text-red-600">
          Error: {error}
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 md:p-4">
        <h2 className="text-center text-lg md:text-2xl font-bold text-slate-600">
          Your Cart Items
        </h2>

        {cartItem && cartItem.length > 0 ? (
          <div className="my-4 flex flex-col md:flex-row gap-3">
            {/* display cart items*/}
            <div className="w-full max-w-3xl">
              {cartItem.map((el) => {
                return (
                  <CartProduct
                    key={el._id}
                    id={el._id}
                    image={el.image}
                    model={el.model}
                    brand={el.brand}
                    price={el.price}
                    qty={el.qty}
                    total={el.total}
                  />
                );
              })}
            </div>
            
            {/* Summary section */}
            <div className="w-full max-w-md ml-auto mt-4 md:mt-0">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="bg-blue-500 text-white p-2 text-lg rounded-t-md">Summary</h2>
                <div className="flex w-full py-2 text-lg border-b">
                  <p>Total Qty:</p>
                  <p className="ml-auto w-32 font-bold">{totalQty}</p>
                </div>
                <div className="flex w-full py-2 text-lg border-b">
                  <p>Total Price:</p>
                  <p className="ml-auto w-32 font-bold">
                    <span className="text-red-500">₹</span> {totalPrice}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 mt-4">
                  <button 
                    onClick={handleClearCart}
                    className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !isLoggedIn}
                  >
                    <BsTrash /> Clear Cart
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-center items-center flex-col">
              <img
                src={emptyCartImage}
                className="w-full max-w-sm"
                style={{ marginTop: "50px" }}
                alt="Empty Cart"
              />
              <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
              <Link 
                to="/" 
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;