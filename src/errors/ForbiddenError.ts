import { ErrorEnum } from "../models/enums/error.enum";
import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
  constructor(errorString: string) {
    super(errorString, ErrorEnum.FORBIDDEN, ForbiddenError.name);
  }
}
