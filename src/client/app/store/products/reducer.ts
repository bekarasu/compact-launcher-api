import { FETCH_PRODUCTS, Products } from "./types";

const initialState: Products = {
  products: null,
};

export default function productReducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        products: action.payload,
      };
    default:
      return state;
  }
}
