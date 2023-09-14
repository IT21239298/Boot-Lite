import React from "react";
import homeimg1 from "../assest/homeimg1.png";
import HomeCard from "../component/HomeCard";
import { useSelector } from "react-redux";
import CardFeature from "../component/CardFeature";

const Home = () => {
  const productData = useSelector((state) => state.product.productList);

  const homeProductCartList = productData.slice(1, 5);
  //select brand
  const homeProductCartListNike = productData.filter(
    (el) => el.brand === "nike",
    []
  );
  console.log(homeProductCartListNike);

  //loading category
  const loadingArray = new Array(4).fill(null);
  return (
    <div className="p-2 md:p-4">
      <div className="md:flex gap-4 py-2">
        <div className="md:w-1/2">
          <div className="flex gap-3 bg-slate-300 w-36 px-1 items-center rounded-full">
            <p className="text-sm font-medium text-slate-900">Football </p>
            <img src={homeimg1} className="h-8" />
          </div>
          <h2 className="text-4xl md:text-7xl font-bold py-3">
            Best of the futer in
            <span className="text-blue-600 text-"> Your goal</span>
          </h2>
          <p className="py-3 text-base ">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries
          </p>
          <button className="font-bold bg-blue-500 text-slate-200 px-2 py-1 rounded-md">
            Order Now
          </button>
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
                return <HomeCard key={index} loading={"Loading..!"} />;
              })}
        </div>
      </div>
      <div className="">
        <h2 className="font-bold text-2xl text-slate-800 mb-4">Nike</h2>
        <div className="">
          {homeProductCartListNike.map((el) => {
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
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
