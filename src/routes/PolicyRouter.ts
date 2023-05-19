import { injectable } from "tsyringe";
import { BaseRouter } from "./BaseRouter";
import { PolicyManager } from "../managers/PolicyManager";
import { PolicyRequest } from "../models/interfaces/policy-request.interface";
import { PolicyResponse } from "../models/interfaces/policy-response.interface";

/**
 * Handles all routes concerning policies.
 */
@injectable()
export class PolicyRouter extends BaseRouter {
  /**
   * Default constructor
   */
  constructor(private policyManager: PolicyManager) {
    super();
    this.buildRoutes();
  }

  /**
   * Given a policy request, calculate risks and return a policy
   */
  public async getPolicy(req, res, next) {
    try {
      const policyRequest = req.body as PolicyRequest;
      if (this.policyManager.validatePolicyRequest(policyRequest)) {
        const policyResponse: PolicyResponse = this.policyManager.getRiskProfile(
          policyRequest
        );
        res.json(policyResponse);
      } else {
        console.error(`Invalid policy request`);
        res.status(400).send("Invalid policy request");
      }
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
