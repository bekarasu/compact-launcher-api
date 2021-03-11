import { FETCH_PROGRAM, FETCH_PROGRAMS, Programs } from "./types";

const initialState: Programs = {
  programs: null,
};

export default function programReducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_PROGRAMS:
      return {
        programs: action.payload,
      };
    case FETCH_PROGRAM:      
      return { program: action.payload };
    default:
      return state;
  }
}
