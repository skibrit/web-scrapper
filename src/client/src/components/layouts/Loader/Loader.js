import React from "react";
import Loader from "react-loader-spinner";
import "./loader.scss";

const LoaderSpinner = ({ type }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-inner-wrapper">
        {type == "button"
          ? <div className="btn-body">
              <Loader type="Bars" color="#d93848" height={25} width={25} />
            </div>
          : <Loader
              type="BallTriangle"
              color="#d93848"
              height={110}
              width={110}
              timeout={-1}
            />}
      </div>
    </div>
  );
};

export default LoaderSpinner;
