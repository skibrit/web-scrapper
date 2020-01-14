import React, { useState, useRef } from "react";
import PropertyForm from "./PropertyForm";
import { connect } from "react-redux";
import { scrapeProperty, saveProperty } from "../../actions/admin";
import { useAlert } from "react-alert";
import "./admin.scss";

const Admin = ({ scrapeProperty, admin: { scrapeResult }, saveProperty }) => {
  const fileChooser = useRef();
  const alert = useAlert();
  const [formData, setFormData] = useState({
    state: "texas",
    name: "The Isle At Watermere"
  });
  const { state, name } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    try {
      e.preventDefault();

      //  const files = fileChooser.current.files;
      // console.log(files);

      // await saveProperty(files);

      if (state == "" || name == "") throw "Please fill all the field";
      let response = await scrapeProperty(state, name.trim());
      alert.show("Scrape Done");
    } catch (error) {
      console.log(error);
      alert.show(error, { type: "error" });
    }
  };

  return (
    <div className="container wrapper">
      <div className="admin-panel">
        <div className="admin-panel-content-wrapper">
          <div className="scrape-form r-row">
            <div className="main-title-wrapper">
              <h3 className="main-title">Scrap Data</h3>
            </div>
            <form className="inline-form" onSubmit={onSubmit}>
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter property name"
                    name="name"
                    onChange={e => onChange(e)}
                    value={name}
                    required
                  />
                </div>
                <div className="col">
                  <select
                    className="custom-select mr-sm-2"
                    id="stateOptionSelector"
                    name="state"
                    onChange={e => onChange(e)}
                    value={state}
                    required
                  >
                    <option defaultValue>Select State</option>
                    <option value="texas">texas</option>
                    <option value="florida">florida</option>
                  </select>
                </div>
                <div className="col">
                  <button className="btn btn-primary">Scrape Data</button>
                </div>
              </div>
            </form>
          </div>
          <div className="scrape-result-wrapper">
            {scrapeResult.map((item, i) => {
              const id = `p_${i}`;
              return <PropertyForm key={id} index={id} data={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  admin: state.admin
});

const mapDispatchToProps = {
  scrapeProperty,
  saveProperty
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
