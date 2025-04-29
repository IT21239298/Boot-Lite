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

  // Add validation states
  const [errors, setErrors] = useState({
    model: "",
    brand: "",
    image: "",
    price: "",
  });

  // Validate model name (should not be empty and at least 3 characters)
  const validateModel = (model) => {
    return model.trim().length >= 3;
  };

  // Validate price (should be a positive number)
  const validatePrice = (price) => {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(price) && parseFloat(price) > 0;
  };

  // Validate brand (shouldn't be default "Other" option)
  const validateBrand = (brand) => {
    return brand && brand !== "Other";
  };

  // Validate image (should not be empty)
  const validateImage = (image) => {
    return image && image.length > 0;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });

    // Clear errors when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      model: "",
      brand: "",
      image: "",
      price: "",
    };

    // Validate model
    if (!data.model.trim()) {
      newErrors.model = "Model name is required";
      valid = false;
    } else if (!validateModel(data.model)) {
      newErrors.model = "Model name should be at least 3 characters";
      valid = false;
    }

    // Validate brand
    if (!data.brand) {
      newErrors.brand = "Please select a brand";
      valid = false;
    } else if (!validateBrand(data.brand)) {
      newErrors.brand = "Please select a valid brand";
      valid = false;
    }

    // Validate image
    if (!validateImage(data.image)) {
      newErrors.image = "Please upload a product image";
      valid = false;
    }

    // Validate price
    if (!data.price) {
      newErrors.price = "Price is required";
      valid = false;
    } else if (!validatePrice(data.price)) {
      newErrors.price = "Please enter a valid price (positive number with up to 2 decimal places)";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation before submission
    if (!validateForm()) {
      // Focus on the first field with an error
      const firstErrorField = Object.keys(errors).find(key => errors[key] !== "");
      if (firstErrorField && document.getElementById(firstErrorField)) {
        document.getElementById(firstErrorField).scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(firstErrorField).focus();
      }
      return;
    }
    
    try {
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

      // Reset form after successful submission
      setData(() => {
        return {
          model: "",
          brand: "",
          image: "",
          price: "",
        };
      });
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      console.error("Product upload error:", error);
    }
  };

  const uploadImage = async (e) => {
    try {
      const data = await ImagetoBase64(e.target.files[0]);
      console.log(data);

      setData((preve) => {
        return {
          ...preve,
          image: data,
        };
      });
      
      // Clear image error when image is uploaded
      setErrors(prev => ({
        ...prev,
        image: ""
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        image: "Failed to upload image. Please try again."
      }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-2xl text-slate-800 mb-4 text-center">
        Add New Product
      </h2>
      <form
        className="m-auto w-full max-w-md shadow flex flex-col p-3 bg-white"
        onSubmit={handleSubmit}
      >
        <label htmlFor="model">Model<span className="text-red-500">*</span></label>
        <input
          type={"text"}
          name="model"
          id="model"
          className={`bg-slate-200 p-1 my-1 ${
            errors.model ? "border-2 border-red-500" : ""
          }`}
          onChange={handleOnChange}
          value={data.model}
          onBlur={() => {
            if (!data.model.trim()) {
              setErrors(prev => ({
                ...prev,
                model: "Model name is required"
              }));
            } else if (!validateModel(data.model)) {
              setErrors(prev => ({
                ...prev,
                model: "Model name should be at least 3 characters"
              }));
            }
          }}
        />
        {errors.model && (
          <p className="text-red-500 text-xs mb-2">{errors.model}</p>
        )}

        <label htmlFor="brand">Brand<span className="text-red-500">*</span></label>
        <select
          className={`bg-slate-200 p-1 my-1 ${
            errors.brand ? "border-2 border-red-500" : ""
          }`}
          id="brand"
          name="brand"
          onChange={handleOnChange}
          value={data.brand}
          onBlur={() => {
            if (!data.brand) {
              setErrors(prev => ({
                ...prev,
                brand: "Please select a brand"
              }));
            } else if (!validateBrand(data.brand)) {
              setErrors(prev => ({
                ...prev,
                brand: "Please select a valid brand"
              }));
            }
          }}
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
        {errors.brand && (
          <p className="text-red-500 text-xs mb-2">{errors.brand}</p>
        )}

        <label htmlFor="image">
          Image<span className="text-red-500">*</span>
          <div 
            className={`h-40 w-full bg-slate-200 rounded flex items-center justify-center cursor-pointer ${
              errors.image ? "border-2 border-red-500" : ""
            }`}
          >
            {data.image ? (
              <img src={data.image} className="h-full" alt="Product" />
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
        {errors.image && (
          <p className="text-red-500 text-xs mb-2">{errors.image}</p>
        )}

        <label htmlFor="price" className="my-1">
          Price<span className="text-red-500">*</span>
        </label>
        <input
          type={"text"}
          className={`bg-slate-200 p-1 my-1 ${
            errors.price ? "border-2 border-red-500" : ""
          }`}
          id="price"
          name="price"
          onChange={handleOnChange}
          value={data.price}
          onBlur={() => {
            if (!data.price) {
              setErrors(prev => ({
                ...prev,
                price: "Price is required"
              }));
            } else if (!validatePrice(data.price)) {
              setErrors(prev => ({
                ...prev,
                price: "Please enter a valid price (positive number with up to 2 decimal places)"
              }));
            }
          }}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mb-2">{errors.price}</p>
        )}

        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium my-2 drop-shadow p-1 rounded"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default NewProduct;