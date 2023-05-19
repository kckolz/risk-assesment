import { ErrorEnum } from "../models/enums/error.enum";
import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(errorString: string) {
    super(errorString, ErrorEnum.NOT_FOUND, NotFoundError.name);
  }
}
