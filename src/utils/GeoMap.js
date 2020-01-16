import NodeGeocoder from "node-geocoder";
import config from "config";

const google = config.get("google");

const geoCoderOption = {
  provider: "google",
  httpAdapter: "https",
  apiKey: google.apiKey,
  formatter: null
};

const geocoder = NodeGeocoder(geoCoderOption);

export const convertAddressToGeoCode = address => {
  return new Promise((resolve, reject) => {
    try {
      geocoder.geocode(address, function(err, res) {
        if (err) {
          reject(err);
        }
        if (res && res[0]) {
          const { latitude, longitude } = res[0];
          resolve({ latitude, longitude });
        }
        resolve({ latitude: 0, longitude: 0 });
      });
    } catch (error) {
      reject(error);
    }
  });
};
