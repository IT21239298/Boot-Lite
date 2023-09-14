import React, { useRef } from "react";
import homeimg1 from "../assest/homeimg1.png";
import HomeCard from "../component/HomeCard";
import { useSelector } from "react-redux";
import CardFeature from "../component/CardFeature";
import { GrPrevious, GrNext } from "react-icons/gr";
import AllProduct from "../component/AllProduct";

const Home = () => {
  const productData = useSelector((state) => state.product.productList);

  const homeProductCartList = productData.slice(1, 5);
  //select brand
  const homeProductCartListNike = productData.filter(
    (el) => el.brand === "Nike",
    []
  );
  console.log(homeProductCartListNike);

  //loading category
  const loadingArray = new Array(4).fill(null);
  const loadingArrayFeature = new Array(10).fill(null);

  //scroling
  const slideProductRef = useRef();
  const nextProduct = () => {
    slideProductRef.current.scrollLeft += 200;
  };
  const preveProduct = () => {
    slideProductRef.current.scrollLeft -= 200;
  };

  return (
    <div className="p-2 md:p-4">
      <div className="md:flex gap-4 py-2">
        <div className="md:w-1/2">
          <div className="flex gap-3 bg-slate-300 w-36 px-1 items-center rounded-full">
            <p className="text-sm font-medium text-slate-900">Football </p>
            <img src={homeimg1} className="h-8" alt="" />
          </div>
          <h2 className="text-4xl md:text-7xl font-bold py-3">
            Look For
            <span className="text-blue-600 text-"> Your GOAL</span>
          </h2>
          <p className="py-3 text-base ">
            "Welcome to premier destination for purchasing football boots
            online! Our website offers a vast selection of high-quality football
            boots from the world's top 100 brands, ensuring that you'll find the
            perfect pair to elevate your game. Whether you're an aspiring
            professional, a dedicated amateur, or just enjoy a casual kickabout
            with friends, we have football boots to suit all skill levels and
            preferences. Browse our extensive catalog and join a community of
            football enthusiasts who trust us for their footwear needs. Elevate
            your game today!"
          </p>
        </div>
        <div className="md:w-1/2 flex flex-wrap gap-5 p-4 justify-center">
          {homeProductCartList[0]
            ? homeProductCartList.map((el) => {
                return (
                  <HomeCard
                    key={el._id}
                    id={el._id}
                    image={el.image}
                    model={el.model}
                    price={el.price}
                    brand={el.brand}
                  />
                );
              })
            : loadingArray.map((el, index) => {
                return <HomeCard key={index} loading="Loading..!" />;
              })}
        </div>
      </div>

      <div className="">
        <div className="flex w-full items-center">
          <h2 className="font-bold text-2xl text-slate-800 mb-4">Nike</h2>
          <div className="ml-auto flex gap-4">
            <button
              onClick={preveProduct}
              className="bg-slate-300 hover:bg-slate-400 text-lg  p-1 rounded"
            >
              <GrPrevious />
            </button>
            <button
              onClick={nextProduct}
              className="bg-slate-300 hover:bg-slate-400 text-lg p-1 rounded "
            >
              <GrNext />
            </button>
          </div>
        </div>
        <div
          className="flex gap-5 overflow-scroll scrollbar-none scroll-smooth transition-all"
          ref={slideProductRef}
        >
          {homeProductCartListNike[0]
            ? homeProductCartListNike.map((el) => {
                return (
                  <CardFeature
                    key={el._id}
                    id={el._id}
                    image={el.image}
                    model={el.model}
                    price={el.price}
                    brand={el.brand}
                  />
                );
              })
            : loadingArrayFeature.map((el, index) => (
                <CardFeature loading="Loading..." key={index} />
              ))}
        </div>
      </div>
      <AllProduct heading={""} />
    </div>
  );
};

export default Home;
