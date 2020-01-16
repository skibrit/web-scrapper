import { combineReducers } from "redux";
import adminState from "./admin";
import propertyState from "./property";

export default combineReducers({
  admin: adminState,
  property: propertyState
});
