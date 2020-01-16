import {
  SEARCH_RESULT,
  PROPERTY_LOADED,
  PROPERTY_NOT_FOUND,
  RESET_PROPERTY
} from "../constants";

const defaultStates = {
  searchResult: [],
  propertyDetail: null,
  isLoading: true
};

export default (state = defaultStates, action) => {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_RESULT:
      return { ...state, searchResult: payload };
    case PROPERTY_LOADED:
      return { ...state, propertyDetail: payload, isLoading: false };
    case PROPERTY_NOT_FOUND:
      return { ...state, propertyDetail: null, isLoading: false };
    case RESET_PROPERTY:
      return defaultStates;
    default:
      return state;
  }
};
