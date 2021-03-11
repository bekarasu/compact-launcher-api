import { IProgram } from "../../../../../@types/common/program";

export const FETCH_PROGRAMS = "fetch_programs";
export const FETCH_PROGRAM = "fetch_program";
export interface Programs {
  programs: Array<IProgram> | null;
}