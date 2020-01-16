import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { useAlert } from "react-alert";
import { searchProperty } from "../../actions/property";
import { useHistory } from "react-router-dom";
import Loader from "../layouts/Loader/Loader";
import "./searchPage.scss";

const SearchPage = ({
  searchProperty,
  property: { searchResult, isLoading }
}) => {
  const history = useHistory();
  const alert = useAlert();
  const [searchTerm, setTerm] = useState("");
  const [isSearching, setLoadingState] = useState(false);

  const onSubmit = async e => {
    try {
      e.preventDefault();
      if (isSearching) {
        alert.show("A request is in progress Have Patience", { type: "error" });
        return;
      }
      setLoadingState(true);
      if (searchTerm && searchTerm.trim() != "") {
        let result = await searchProperty(searchTerm);
        setLoadingState(false);
        if (result.length <= 0) {
          alert.show("No Property Found");
        }
      } else {
        throw "Please enter something to search";
      }
    } catch (error) {
      console.log(error);
      setLoadingState(false);
      alert.show(error, { type: "error" });
    }
  };

  return (
    <div className="container wrapper">
      <div className="search-panel">
        <div className="search-area-box r-row">
          <div className="main-title-wrapper">
            <h3 className="main-title">Search Property</h3>
          </div>
          <form className="inline-form" onSubmit={onSubmit}>
            <div className="row">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="searchField"
                  placeholder="name/city/state"
                  name="searchField"
                  onChange={e => {
                    setTerm(e.target.value);
                  }}
                  value={searchTerm}
                  required
                />
              </div>
              <div className="col">
                <button className="btn btn-primary">
                  {!isSearching
                    ? "Search"
                    : <Fragment>
                        Processing <Loader type="button" />
                      </Fragment>}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="search-result-box r-row">
          <div className="main-title-wrapper">
            <h3 className="main-title">Search Result</h3>
          </div>
          <div className="table-wrapper">
            {searchResult.length > 0 &&
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">City</th>
                    <th scope="col">State</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map(
                    ({ _id, code, state, city, name, type }) => {
                      return (
                        <tr key={code}>
                          <td>
                            {name}
                          </td>
                          <td>
                            {type}
                          </td>
                          <td>
                            {city}
                          </td>
                          <td>
                            {state}
                          </td>
                          <td className="td-btn-col">
                            <button
                              className="btn btn-info"
                              onClick={() => {
                                history.push(`/property/${_id}`);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  property: state.property
});

const mapDispatchToProps = {
  searchProperty
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
