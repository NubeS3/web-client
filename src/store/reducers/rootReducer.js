import { combineReducers } from "redux";
import authenticateReducer from "../reducers/authenticateReducer";

const rootReducer = combineReducers({
  authenticateReducer,
});

export default rootReducer;
