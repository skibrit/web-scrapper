import React from "react";
import Img from "react-image";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./imgLoader.scss";

const ImageLoader = ({ src }) => {
  return (
    <Img
      src={src}
      loader={
        <div className="img-loader">
          <Loader
            type="Puff"
            color="#00BFFF"
            height={35}
            width={35}
            timeout={-1}
          />
        </div>
      }
    />
  );
};

export default ImageLoader;
