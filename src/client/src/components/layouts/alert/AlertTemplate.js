import React from "react";
import "./alert.scss";
import parser from "html-react-parser";

const AlertTemplate = ({ style, options: { type }, message, close }) => {
  return (
    <div style={style} className="alert-box">
      <div className="alert-body">
        <div className={type == "error" ? "error-body" : "info-body"}>
          {parser(message)}
        </div>
      </div>
      <div className="alert-close-btn" onClick={close}>
        X
      </div>
    </div>
  );
};

export default AlertTemplate;
