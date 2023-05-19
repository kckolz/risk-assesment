import { injectable } from "tsyringe";
import { BaseRouter } from "./BaseRouter";
import { PolicyManager } from "../managers/PolicyManager";
import { PolicyRequest } from "../models/interfaces/policy-request.interface";

/**
 * Handles all routes concerning policies.
 */
@injectable()
export class PolicyRouter extends BaseRouter {
  /**
   * Default constructor
   */
  constructor(
    private riskManager: PolicyManager
  ) {
    super();
    this.buildRoutes();
  }

  /**
   * Given a district basic info by ID.
   */
  public async getPolicy(
    req,
    res,
    next
  ) {
    try {
      const policyRequest = req.body as PolicyRequest;
      const policyResponse = this.riskManager.getRiskProfile(policyRequest);
      res.json(policyResponse);
    } catch (err) {
      console.error(`Error getting policy: ${err}`);
      next(err);
    }
  }

  /**
   * Binds these routes to the express router on startup.
   */
  private buildRoutes() {
    this.router.post("/", this.getPolicy.bind(this));
  }
}
