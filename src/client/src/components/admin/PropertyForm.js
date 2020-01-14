import React, { useRef, useState } from "react";
import { connect } from "react-redux";
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

  const onSubmit = async e => {
    try {
      e.preventDefault();
      const files = fileChooser.current.files;
      let response = await saveProperty(data, files);
      alert.show(response);
    } catch (error) {
      console.log(error);
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
          <div class="form-group col-md-2">
            <label htmlFor="inputZip">Zip</label>
            <input
              type="text"
              className="form-control"
              id="inputZip"
              value={zipCode}
              disabled
            />
          </div>
          <div class="form-group col-md-2">
            <label htmlFor="inputCountry">Country</label>
            <input
              type="text"
              className="form-control"
              id="inputCountry"
              value={country}
              disabled
            />
          </div>
          <div class="form-group col-md-2">
            <label htmlFor="inputCapacity">Capacity</label>
            <input
              type="text"
              className="form-control"
              id="inputCapacity"
              value={capacity}
              disabled
            />
          </div>
          <div class="form-group col-md-2">
            <label htmlFor="inputType">Type</label>
            <input
              type="text"
              className="form-control"
              id="inputType"
              value={type}
              disabled
            />
          </div>
          <div class="form-group col-md-12">
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
        <button type="submit" className="btn btn-primary">
          Save Data
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
