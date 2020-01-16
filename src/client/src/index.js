import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/js/src/collapse.js";
import "./index.scss";
import App from "./App";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/layouts/alert/AlertTemplate";

// alert config
const options = {
  position: positions.MIDDLE,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE
};

ReactDOM.render(
  <Provider store={Store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById("root")
);
