/**
 * Create Server
 */
import "reflect-metadata";
import { Server } from "./server";

Server.initializeApp()
  .then(() => {
    console.info(
      `App is running at http://localhost:${Server.app.get(
        "port"
      )} in [${Server.app.get("env")}] mode`
    );
  })
  .catch((error) => {
    console.error(
      { err: error },
      "Error starting the Risk Assessment API. " + error.message
    );
  });
