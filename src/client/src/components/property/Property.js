import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Slider from "../layouts/slider/Slider";
import GoogleMapReact from "google-map-react";
import { fetchProperty } from "../../actions/property";
import Loader from "../layouts/Loader/Loader";
import "./property.scss";

const Property = ({
  fetchProperty,
  property: { isLoading, propertyDetail },
  match: { params: { id } }
}) => {
  useEffect(
    () => {
      fetchProperty(id);
    },
    [fetchProperty]
  );

  const renderMarkers = (map, maps, lat, long) => {
    let marker = new maps.Marker({
      position: {
        lat: parseFloat(lat),
        lng: parseFloat(long)
      },
      map,
      title: (propertyDetail && propertyDetail.name) || "Marker"
    });
    return marker;
  };

  const renderProperty = () => {
    return (
      <Fragment>
        {propertyDetail
          ? <Fragment>
              <div className="property-image-slider-wrapper r-row">
                <div className="property-image-slider">
                  <Slider images={propertyDetail.images} />
                </div>
              </div>
              <div className="property-content-wrapper">
                <div className="property-detail-wrapper r-row">
                  <div className="main-title-wrapper">
                    <h3 className="main-title">
                      {propertyDetail.name}
                    </h3>
                  </div>
                  <div className="property-info-wrapper">
                    <div className="property-info-row">
                      <div className="p-label-col">Type</div>
                      <div className="p-value-col">
                        {propertyDetail.type}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">Address</div>
                      <div className="p-value-col">
                        {propertyDetail.address}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">City</div>
                      <div className="p-value-col">
                        {propertyDetail.city}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">Zip Code</div>
                      <div className="p-value-col">
                        {propertyDetail.zipCode}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">State</div>
                      <div className="p-value-col">
                        {propertyDetail.state}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">Country</div>
                      <div className="p-value-col">
                        {propertyDetail.country}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">Phone</div>
                      <div className="p-value-col">
                        {propertyDetail.phone}
                      </div>
                    </div>
                    <div className="property-info-row">
                      <div className="p-label-col">Capacity</div>
                      <div className="p-value-col">
                        {propertyDetail.capacity}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="location-map-wrapper r-row">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: propertyDetail.apiKey
                    }}
                    defaultCenter={{
                      lat: 59.95,
                      lng: 30.33
                    }}
                    center={{
                      lat: parseFloat(propertyDetail.latitude),
                      lng: parseFloat(propertyDetail.longitude)
                    }}
                    defaultZoom={14}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                      renderMarkers(
                        map,
                        maps,
                        propertyDetail.latitude,
                        propertyDetail.longitude
                      )}
                  />
                </div>
              </div>
            </Fragment>
          : <div className="default-div">
              <h3 className="default-text">404 Not Found!</h3>
            </div>}
      </Fragment>
    );
  };

  return (
    <div className="container wrapper">
      <div className="property-page-wrapper">
        {!isLoading ? renderProperty() : <Loader />}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  property: state.property
});

const mapDispatchToProps = {
  fetchProperty
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);
