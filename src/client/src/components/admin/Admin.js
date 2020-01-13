import React from "react";
import "./admin.scss";

const Admin = () => {
  return (
    <div className="container wrapper">
      <div className="admin-panel">
        <div className="main-title-wrapper">
          <h3 className="main-title">Property Scrapper</h3>
        </div>
        <div className="admin-panel-content-wrapper">
          <form className="inline-form">
            <div class="row">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  id="searchTerm"
                  placeholder="Enter property name"
                  name="searchTerm"
                />
              </div>
              <div class="col">
                <select class="custom-select mr-sm-2" id="stateOptionSelector">
                  <option selected>Select State</option>
                  <option value="texas">texas</option>
                  <option value="florida">florida</option>
                </select>
              </div>
              <div class="col">
                <button className="btn btn-primary">Scrape Data</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
