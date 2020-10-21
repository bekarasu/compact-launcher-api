import { authReducer } from "./authenticate/reducers";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import { resultReducer } from './result/reducers';
import { themeReducer } from "./theme/reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  result: resultReducer,
  theme: themeReducer
});

// export type RootState = ReturnType<typeof rootReducer>

export const configureStore = () => {
  return createStore(rootReducer);
};
