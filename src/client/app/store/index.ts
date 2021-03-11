import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import programReducer from "./programs/reducer";
const rootReducer = combineReducers({
  programs: programReducer,
});

declare global {
  interface Window {
    INITIAL_STATE: any;
  }
}

let state = typeof window != "undefined" ? window.INITIAL_STATE : {};

export const store = createStore(rootReducer, state, applyMiddleware(thunk));
