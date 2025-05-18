import { Outlet } from "react-router-dom";
import Header from "./component/Header";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./redux/productSlice"; // Import fetchProducts thunk
import { fetchCartItems } from "./redux/cartSlice"; // Import fetchCartItems thunk

function App() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product);
  const userData = useSelector((state) => state.user);
  
  // Fetch products when app loads
  useEffect(() => {
    // Fetch products using the async thunk
    dispatch(fetchProducts())
      .unwrap()
      .then(() => {
        console.log("Products fetched successfully");
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      });
  }, [dispatch]);
  
  // Fetch cart items if user is logged in
  useEffect(() => {
    if (userData._id) {
      dispatch(fetchCartItems())
        .unwrap()
        .then(() => {
          console.log("Cart items fetched successfully");
        })
        .catch((error) => {
          console.error("Failed to fetch cart items:", error);
          // Don't show error toast to user as it might be confusing
        });
    }
  }, [dispatch, userData._id]);

  console.log(productData);

  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;