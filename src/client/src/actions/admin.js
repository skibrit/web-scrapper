import axios from "axios";
import { SCRAPE_DONE, REMOVE_PROPERTY } from "../constants";
import { extractError } from "../models/ErrorHandler";

export const scrapeProperty = (state, name) => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const body = { state, name };
      let response = await axios.post(`/api/property/scrape`, body, config);
      console.log(response.data);
      dispatch({
        type: SCRAPE_DONE,
        payload: response.data
      });
      resolve(true);
    } catch (error) {
      reject(extractError(error));
    }
  });
};

export const saveProperty = (formData, photos) => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(formData);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
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
      } = formData;
      const bodyFormData = new FormData();
      //attach formdata
      bodyFormData.append("name", name);
      bodyFormData.append("address", address);
      bodyFormData.append("city", city);
      bodyFormData.append("state", state);
      bodyFormData.append("zipCode", zipCode);
      bodyFormData.append("type", type);
      bodyFormData.append("code", code);
      bodyFormData.append("capacity", capacity);
      bodyFormData.append("phone", phone);
      bodyFormData.append("country", country);

      for (let i = 0; i < photos.length; i++) {
        bodyFormData.append("files", photos[i]);
      }

      let response = await axios.post(
        `/api/property/save`,
        bodyFormData,
        config
      );
      console.log(response.data);
      resolve(response.data.msg);
    } catch (error) {
      reject(extractError(error));
    }
  });
};

export const removeProperty = code => dispatch => {
  try {
    dispatch({
      type: REMOVE_PROPERTY,
      payload: code
    });
  } catch (error) {
    console.log(error);
  }
};
