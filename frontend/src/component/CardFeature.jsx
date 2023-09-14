import React from "react";

const CardFeature = ({ model, brand, image, price }) => {
  return (
    <div>
      <div className="h-20">
        <img src={image} className="h-full" />
      </div>
    </div>
  );
};

export default CardFeature;
