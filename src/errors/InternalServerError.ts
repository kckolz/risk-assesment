import { ErrorEnum } from "../models/enums/error.enum";
import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
  constructor(errorString: string) {
    super(errorString, ErrorEnum.INTERNAL, InternalServerError.name);
  }
}
