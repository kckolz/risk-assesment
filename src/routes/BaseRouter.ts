import { Router } from "express";

/**
 * The Base Router with common properties and utilities that all other routers should inherit.
 */
export class BaseRouter {
  /**
   * Reference to a fresh express router.
   */
  public router: Router;

  /**
   * Default Constructor
   */
  constructor() {
    this.router = Router();
  }
}
