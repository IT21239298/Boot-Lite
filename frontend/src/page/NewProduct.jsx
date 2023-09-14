import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const { model, brand, image, price } = data;

    if (model && brand && image && price) {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/uploadProduct`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const fetchRes = await fetchData.json();

      console.log(fetchRes);
      toast(fetchRes.message);

      setData(() => {
        return {
          model: "",
          brand: "",
          image: "",
          price: "",
        };
      });
    } else {
      toast("Enter required Fields");
    }
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
      <h2 className="font-bold text-2xl text-slate-800 mb-4 text-center">
        Add New Product
      </h2>
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
          value={data.model}
        />

        <label htmlFor="category">Brand</label>
        <select
          className="bg-slate-200 p-1 my-1"
          id="brand"
          name="brand"
          onChange={handleOnChange}
          value={data.brand}
        >
          <option value={"Other"}>Select Brand</option>
          <option value={"Nike"}>Nike</option>
          <option value={"Puma"}>Puma</option>
          <option value={"Adidas"}>Adidas</option>
          <option value={"Asics"}>Asics</option>
          <option value={"Lotto"}>Lotto</option>
          <option value={"Mizuno"}>Mizuno</option>
          <option value={"New balance"}>New Balance</option>
          <option value={"Umbro"}>Umbro</option>
          <option value={"Under armour"}>Under Armour</option>
        </select>

        <label htmlFor="image">
          Image
          <div className="h-40 w-full bg-slate-200  rounded flex items-center justify-center cursor-pointer">
            {data.image ? (
              <img src={data.image} className="h-full" alt="" />
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
          value={data.price}
        />

        <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium my-2 drop-shadow">
          Save
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
