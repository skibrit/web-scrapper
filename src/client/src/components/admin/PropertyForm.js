import React, { useRef, useState, Fragment } from "react";
import { connect } from "react-redux";
import Loader from "../layouts/Loader/Loader";
import { removeProperty, saveProperty } from "../../actions/admin";
import { useAlert } from "react-alert";
import "./admin.scss";

const PropertyForm = ({ data, removeProperty, saveProperty }) => {
  const {
    name,
    address,
    city,
    state,
    zipCode,
    phone,
    type,
    code,
    capacity,
    country
  } = data;

  const fileChooser = useRef();
  const alert = useAlert();
  const [fileSelected, setFileSelected] = useState(0);
  const [isLoading, setLoadingState] = useState(false);

  const onSubmit = async e => {
    try {
      e.preventDefault();
      if (isLoading) {
        alert.show("A request is in progress Have Patience", { type: "error" });
        return;
      }
      setLoadingState(true);
      const files = fileChooser.current.files;
      if (files.length <= 0) throw "Please attach atleast one image";
      let response = await saveProperty(data, files);
      setLoadingState(false);
      alert.show(response);
    } catch (error) {
      console.log(error);
      setLoadingState(false);
      alert.show(error, { type: "error" });
    }
  };

  return (
    <div className="scrape-result-row r-row">
      <div
        className="remove-btn"
        onClick={() => {
          removeProperty(code);
        }}
      >
        X
      </div>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail4">Name</label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Name"
              value={name}
              disabled
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputPassword4">Phone</label>
            <input
              type="text"
              className="form-control"
              id="inputPhone"
              placeholder="Phone"
              value={phone}
              disabled
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputAddress">Address</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="1234 Main St"
            value={address}
            disabled
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputCity">City</label>
            <input
              type="text"
              className="form-control"
              id="inputCity"
              value={city}
              disabled
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputState">State</label>
            <input
              type="text"
              className="form-control"
              id="inputState"
              value={state}
              disabled
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="inputZip">Zip</label>
            <input
              type="text"
              className="form-control"
              id="inputZip"
              value={zipCode}
              disabled
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="inputCountry">Country</label>
            <input
              type="text"
              className="form-control"
              id="inputCountry"
              value={country}
              disabled
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="inputCapacity">Capacity</label>
            <input
              type="text"
              className="form-control"
              id="inputCapacity"
              value={capacity ? capacity : 0}
              disabled
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="inputType">Type</label>
            <input
              type="text"
              className="form-control"
              id="inputType"
              value={type}
              disabled
            />
          </div>
          <div className="form-group col-md-12">
            <label htmlFor="inputCapacity">Images</label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                ref={fileChooser}
                multiple
                onChange={() => {
                  setFileSelected(fileChooser.current.files.length);
                }}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {fileSelected > 0
                  ? `${fileSelected} Attached`
                  : "Choose Images"}
              </label>
            </div>
          </div>
        </div>
        <button className="btn btn-primary">
          {!isLoading
            ? "Save Data"
            : <Fragment>
                Processing <Loader type="button" />
              </Fragment>}
        </button>
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  removeProperty,
  saveProperty
};

export default connect(null, mapDispatchToProps)(PropertyForm);
