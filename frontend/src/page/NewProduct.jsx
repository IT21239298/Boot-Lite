import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { ImagetoBase64 } from "../utility/ImagetoBase64";

const NewProduct = () => {
  const [data, setData] = useState({
    model: "",
    brand: "",
    image: "",
    price: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = () => {
    console.log(data);
  };
  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    console.log(data);

    setData((preve) => {
      return {
        ...preve,
        image: data,
      };
    });
  };

  return (
    <div className="p-4">
      <form
        className="m-auto w-full max-w-md  shadow flex flex-col p-3 bg-white"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Model</label>
        <input
          type={"text"}
          name="model"
          className="bg-slate-200 p-1 my-1"
          onChange={handleOnChange}
        />

        <label htmlFor="category">Brand</label>
        <select
          className="bg-slate-200 p-1 my-1"
          id="brand"
          name="brand"
          onChange={handleOnChange}
        >
          <option value={"other"}>Select Brand</option>
          <option value={"rice"}>Nike</option>
          <option value={"cake"}>Puma</option>
          <option value={"fruits"}>Adidas</option>
          <option value={"vegetable"}>Asics</option>
          <option value={"icream"}>Lotto</option>
          <option value={"dosa"}>Mizuno</option>
          <option value={"pizza"}>New Balance</option>
          <option value={"burger"}>Umbro</option>
          <option value={"panner"}>Under Armour</option>
        </select>

        <label htmlFor="image">
          Image
          <div className="h-40 w-full bg-slate-200  rounded flex items-center justify-center cursor-pointer">
            {data.image ? (
              <img src={data.image} className="h-full" />
            ) : (
              <span className="text-5xl">
                <BsCloudUpload />
              </span>
            )}
            <input
              type={"file"}
              accept="image/*"
              id="image"
              onChange={uploadImage}
              className="hidden"
            />
          </div>
        </label>

        <label htmlFor="price" className="my-1">
          Price
        </label>
        <input
          type={"text"}
          className="bg-slate-200 p-1 my-1"
          name="price"
          onChange={handleOnChange}
        />

        <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium my-2 drop-shadow">
          Save
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
