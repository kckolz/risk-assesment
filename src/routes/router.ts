import "reflect-metadata";
import {
  Request,
  Response,
  Router as ExpressRouter
} from "express";
import { container } from "tsyringe";
import { PolicyRouter } from "./PolicyRouter";

export class Router {
  public static async initializeRoutes(router: ExpressRouter) {
    // Setup health route
    Router.setupHealthRoute(router);

    // Setup policies route
    router.use("/policies", container.resolve(PolicyRouter).router);
  }


  /**
   * Route used to check if the API is running and responding to requests
   *
   * @param router The router on which the health route will be appended
   */
  private static setupHealthRoute(router: ExpressRouter) {
    router.all("/health", (req: Request, res: Response) => {
      res.json({
        success: 1
      });
    });
  }
}
