import React, { useState, useRef, Fragment } from "react";
import PropertyForm from "./PropertyForm";
import Loader from "../layouts/Loader/Loader";
import { connect } from "react-redux";
import { scrapeProperty, clearResult } from "../../actions/admin";
import { useAlert } from "react-alert";
import "./admin.scss";

const Admin = ({ scrapeProperty, admin: { scrapeResult }, clearResult }) => {
  const alert = useAlert();

  const [isLoading, setLoadingState] = useState(false);

  const [formData, setFormData] = useState({
    state: "",
    name: ""
  });
  const { state, name } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    try {
      e.preventDefault();
      if (isLoading) {
        alert.show("A request is in progress Have Patience", { type: "error" });
        return;
      }
      clearResult();
      setLoadingState(true);
      if (state == "" || name == "") throw "Please fill all the field";
      let response = await scrapeProperty(state, name.trim());
      setLoadingState(false);
    } catch (error) {
      console.log(error);
      setLoadingState(false);
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
                  <button className="btn btn-primary">
                    {!isLoading
                      ? "Scrape Data"
                      : <Fragment>
                          Processing <Loader type="button" />
                        </Fragment>}
                  </button>
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
  clearResult
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
