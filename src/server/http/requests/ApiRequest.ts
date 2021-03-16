import { ValidationChain } from "express-validator";

export default abstract class ApiRequest {
  abstract validate(): Array<ValidationChain>
}
