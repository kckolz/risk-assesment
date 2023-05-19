import { ErrorEnum } from "../models/enums/error.enum";
import { BaseError } from "./BaseError";

export class TestError extends BaseError {
  constructor(errorString: string) {
    super(errorString, ErrorEnum.TEST, TestError.name);
  }
}
