import * as express from "express";
import * as http from "http";
import * as morgan from "morgan";
import helmet from "helmet";
import { Router } from "./routes/router";
import { InternalServerError } from "./errors/InternalServerError";

/**
 * The main application that handles setting up and initializing the express server application.
 */
export class Server {
  /**
   * A static reference to the current context of the running Express Application.
   */
  public static app: express.Express;

  /**
   * The express application configuration
   */
  public static async initializeApp(): Promise<http.Server> {
    try {
      // Create the instance of the express application.
      Server.app = express();

      // HELMET dependency to add recommended security things. You can look at everything it does by default
      // by checking the link(s) below.
      // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
      // https://www.npmjs.com/package/helmet
      Server.app.use(helmet());

      // Initialize the logger that our application will use.
      Server.initializeLogging();

      // Configure application
      Server.configureApp();

      // Initialize Routes
      await Server.initializeRoutes();

      // Start server
      return Server.app.listen(Server.app.get("port"));
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  /**
   * Configures and binds routes that the API will use.
   */
  private static async initializeRoutes() {
    const v1Router = express.Router();
    await Router.initializeRoutes(v1Router);
    Server.app.use("/v1", v1Router);
    Server.app.use("/", v1Router); // Set the default version to latest.
  }

  /**
   * Various configuration and setup for the application.
   */
  private static configureApp() {
    // all environments
    Server.app.set("port", process.env.PORT || 3000);
    Server.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    Server.app.use(express.json({ limit: "50mb" }));
    Server.app.use(
      morgan("dev", {
        skip(req, res) {
          return res.statusCode >= 400;
        },
        stream: process.stdout
      })
    );
  }

  /**
   * Sets up the logging and error handling that the application will use.
   */
  private static initializeLogging() {
    // We don't want to ever hit these uncaught exceptions but these are here jic
    process.on("unhandledRejection", (reason, p) => {
      console.error("reason: ", reason);
    });
    // eslint-disable-next-line
    process.on("uncaughtException", (reason) => {
      console.error("reason: ", reason);
    });
  }
}
