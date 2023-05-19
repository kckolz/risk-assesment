import { ErrorEnum } from "../models/enums/error.enum";
import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
  constructor(errorString: string) {
    super(errorString, ErrorEnum.VALIDATION, ValidationError.name);
  }
}
