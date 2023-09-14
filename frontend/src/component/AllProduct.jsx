import React, { useEffect, useState } from "react";
import CardFeature from "./CardFeature";
import { useSelector } from "react-redux";
import FilterProduct from "./FilterProduct";

const AllProduct = ({ heading }) => {
  const productData = useSelector((state) => state.product.productList);
  //category product
  const brandList = [...new Set(productData.map((el) => el.brand))];
  console.log(brandList);

  //dislay filter branddetails

  const [filterby, setFilterBy] = useState("");
  const [dataFilter, setDataFilter] = useState([]);

  useEffect(() => {
    setDataFilter(productData);
  }, [productData]);

  const handleFiterBrand = (brand) => {
    const filter = productData.filter(
      (el) => el.brand.toLowerCase() === brand.toLowerCase()
    );
    setDataFilter(() => {
      return [...filter];
    });
  };

  const loadingArrayFeature = new Array(10).fill(null);
  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl text-slate-800 mb-4">
        Branded Product {heading}
      </h2>
      <div className="flex gap-4 justify-center overflow-scroll scrollbar-none">
        {brandList[0] ? (
          brandList.map((el, index) => {
            return (
              <FilterProduct
                brand={el}
                onClick={() => handleFiterBrand(el)}
                isActive={el.toLowerCase() === filterby.toLowerCase()}
                key={index}
              />
            );
          })
        ) : (
          <div className="flex justify-center  text-red-500 items-center h-full">
            <p>Loading...</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-4 my-4">
        {dataFilter[0]
          ? dataFilter.map((el) => {
              return (
                <CardFeature
                  key={el._id}
                  id={el._id}
                  image={el.image}
                  model={el.model}
                  brand={el.brand}
                  price={el.price}
                />
              );
            })
          : loadingArrayFeature.map((el, index) => (
              <CardFeature loading="Loading..." key={index + "allProduct"} />
            ))}
      </div>
    </div>
  );
};

export default AllProduct;
