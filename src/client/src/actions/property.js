import axios from "axios";
import {
  SEARCH_RESULT,
  PROPERTY_LOADED,
  PROPERTY_NOT_FOUND
} from "../constants";
import { extractError } from "../models/ErrorHandler";

export const fetchProperty = id => async dispatch => {
  try {
    let response = await axios.get(`/api/property/${id}`);
    const { property, apiKey } = response.data;
    //  console.log(response.data);
    dispatch({
      type: PROPERTY_LOADED,
      payload: { ...property, apiKey }
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PROPERTY_NOT_FOUND,
      payload: null
    });
  }
};

export const searchProperty = searchTerm => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const body = { searchTerm };
      let response = await axios.post(`/api/property/search`, body, config);
      dispatch({
        type: SEARCH_RESULT,
        payload: response.data
      });
      resolve(response.data);
    } catch (error) {
      reject(extractError(error));
    }
  });
};
