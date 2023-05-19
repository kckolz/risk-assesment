import * as http from "http";
import { Server } from "../../server"

/**
 * Handles setting up and tearing down the Test Server Instance.
 */
export class TestInit {
  /**
   * A reference to the running server for the test instance as returned by the main `server.ts`
   */
  public static testServer: http.Server;

  /**
   * This will handle spinning up an instance of the server application, starting the MongoDB--then seeding the data into it.
   */
  public static async initializeTestSuite() {
    try {
      TestInit.testServer = await Server.initializeApp();
      return this.testServer;
    } catch (error) {
      console.error(
        { err: JSON.stringify(error) },
        "An error occurred when attempting to initialize the testing server. This could be an error with seed data or initializing the server.js instance."
      );
    }
  }

  /**
   * Shuts down the database connection and stops the test HTTP server.
   */
  public static async tearDownTestSuite() {
    await TestInit.testServer.close();
  }
}
