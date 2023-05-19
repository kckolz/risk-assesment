import * as express from "express";
import * as http from "http";
import * as morgan from "morgan";
import helmet from "helmet";
import { Router } from "./routes/router";

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

      // Helmet adds recommended security configuration
      Server.app.use(helmet());

      // Handle exceptions that slip through the cracks
      Server.logUnhandledException();

      // Configure application
      Server.configureApp();

      // Initialize Routes
      await Server.initializeRoutes();

      // Start server
      return Server.app.listen(Server.app.get("port"));
    } catch (error) {
      console.error(`Error initializing application: ${error.message}`);
      throw new Error(error.message);
    }
  }

  /**
   * Configures and binds routes that the API will use.
   */
  private static async initializeRoutes() {
    const mainRouter = express.Router();
    await Router.initializeRoutes(mainRouter);
    Server.app.use("/", mainRouter);
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
        stream: process.stdout,
      })
    );
  }

  /**
   * Catches any unhandled exceptions and logs them to the console.
   */
  private static logUnhandledException() {
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
