import axios, { AxiosError } from "axios";
import { appApiURL } from "../../../resources/strings/apiURL";
import { FETCH_PROGRAM, FETCH_PROGRAMS } from "./types";

export async function fetchPrograms() {
  const res = await axios.get(appApiURL + "programs");
  return {
    type: FETCH_PROGRAMS,
    payload: res.data.data,
  };
}

export async function fetchProgram(name: string) {
  return await axios.get(appApiURL + "programs/" + name).then(res => {
    return {
      type: FETCH_PROGRAM,
      payload: res.data.data,
    };
  }).catch((err: AxiosError) => {
    if (typeof err.response !== "undefined") { // it means the error gets from server
    } else {
      // TODO log the error
    }
    return {
      type: FETCH_PROGRAM,
      payload: {}
    };
  });
}
