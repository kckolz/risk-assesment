import { singleton } from "tsyringe";
import { PolicyRequest } from "../models/interfaces/policy-request.interface";
import { PolicyResponse } from "../models/interfaces/policy-response.interface";
import { PolicyScoreEnum } from "../models/enums/policy-score.enum";
import { RiskScores } from "../models/interfaces/risk-scores.interface";
import { OwnerShipStatusEnum } from "../models/enums/ownership-status.enum";
import { MarriageStatusEnum } from "../models/enums/marriage-status.enum";
import { PolicyTypeEnum } from "../models/enums/policy-type.enum";

@singleton()
export class PolicyManager {
  constructor() {}

  /**
   * Calculates risks given a policy request and determines eligibility
   * @param policyRequest The policy request from the user
   */
  public getRiskProfile(policyRequest: PolicyRequest): PolicyResponse {
    // Get base score based on risk questions
    const baseScore = this.getBaseScore(policyRequest.risk_questions);

    // Initialize risk scores with base score
    const riskScores: RiskScores = {
      life: baseScore,
      disability: baseScore,
      home: baseScore,
      auto: baseScore,
    };

    // If the user is under 30 years old, deduct 2 risk points from all lines of insurance. If the user is between 30 and 40 years old, deduct 1.
    if (policyRequest.age < 30) {
      this.deductRiskPoints(riskScores, 2);
    } else if (policyRequest.age >= 30 && policyRequest.age <= 40) {
      this.deductRiskPoints(riskScores, 1);
    }

    // If the user's income is above $200k, deduct 1 risk point from all lines of insurance.
    if (policyRequest.income > 200000) {
      this.deductRiskPoints(riskScores, 1);
    }

    // If the user's house is mortgaged, add 1 risk point to her home score and add 1 risk point to her disability score.
    if (
      policyRequest.house.ownership_status === OwnerShipStatusEnum.MORTGAGED
    ) {
      this.addRiskPoints(
        riskScores,
        [PolicyTypeEnum.HOME, PolicyTypeEnum.DISABILITY],
        1
      );
    }

    // If the user has dependents, add 1 risk point to both the disability and life scores.
    if (policyRequest.dependents > 0) {
      this.addRiskPoints(
        riskScores,
        [PolicyTypeEnum.DISABILITY, PolicyTypeEnum.LIFE],
        1
      );
    }

    // If the user is married, add 1 risk point to the life score and remove 1 risk point from disability.
    if (policyRequest.marital_status === MarriageStatusEnum.MARRIED) {
      this.addRiskPoints(riskScores, [PolicyTypeEnum.LIFE], 1);
      this.deductRiskPoints(riskScores, 1, [PolicyTypeEnum.DISABILITY]);
    }

    // If the user's vehicle was produced in the last 5 years, add 1 risk point to that vehicle’s score.
    const currentYear = new Date().getFullYear();
    if (policyRequest.vehicle.year >= currentYear - 5) {
      this.addRiskPoints(riskScores, [PolicyTypeEnum.AUTO], 1);
    }

    // Map the risk scores to a policy response
    let policyResponse: PolicyResponse = this.mapRiskScoresToPolicyResponse(
      riskScores
    );

    // Determine ineligibility based on specific criteria before returning the policy response
    policyResponse = this.determineIneligibility(policyRequest, policyResponse);
    return policyResponse;
  }

  /**
   * Validates a policy request to ensure it has the correct properties
   * @param policyRequest The policy request from the user
   */
  public validatePolicyRequest(policyRequest: PolicyRequest): boolean {
    return (
      policyRequest &&
      "age" in policyRequest &&
      typeof policyRequest.age === "number" &&
      "dependents" in policyRequest &&
      typeof policyRequest.dependents === "number" &&
      policyRequest.house &&
      "income" in policyRequest &&
      typeof policyRequest.income === "number" &&
      typeof policyRequest.house == "object" &&
      policyRequest.marital_status &&
      typeof policyRequest.marital_status == "string" &&
      policyRequest.vehicle &&
      typeof policyRequest.vehicle == "object"
    );
  }

  /**
   * Averages the risk questions to determine a base score
   * @param riskQuestions An array of 0s and 1s representing the answers to the risk questions
   * @private
   */
  private getBaseScore(riskQuestions: number[]): number {
    return riskQuestions.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  }

  /**
   * Determine insurance eligibility based on specific criteria
   * @param policyRequest The policy request from the user
   * @param policyResponse The policy response to be returned to the user
   * @private
   */
  private determineIneligibility(
    policyRequest: PolicyRequest,
    policyResponse: PolicyResponse
  ): PolicyResponse {
    if (policyRequest.income === 0) {
      policyResponse.disability = PolicyScoreEnum.INELIGIBLE;
    }
    if (
      policyRequest.vehicle === null ||
      Object.keys(policyRequest.vehicle).length === 0
    ) {
      policyResponse.auto = PolicyScoreEnum.INELIGIBLE;
    }
    if (
      policyRequest.house === null ||
      Object.keys(policyRequest.house).length === 0
    ) {
      policyResponse.home = PolicyScoreEnum.INELIGIBLE;
    }
    if (policyRequest.age > 60) {
      policyResponse.disability = PolicyScoreEnum.INELIGIBLE;
      policyResponse.life = PolicyScoreEnum.INELIGIBLE;
    }
    return policyResponse;
  }

  /**
   * Deducts points from risk scores for the given lines of insurance
   * @param scores The risk scores to deduct points from
   * @param points The number of points to deduct
   * @param lines An array containing any combination of insurance policies
   * @private
   */
  private deductRiskPoints(
    scores: RiskScores,
    points: number,
    lines: (
      | PolicyTypeEnum.LIFE
      | PolicyTypeEnum.DISABILITY
      | PolicyTypeEnum.HOME
      | PolicyTypeEnum.AUTO
    )[] = [
      PolicyTypeEnum.LIFE,
      PolicyTypeEnum.DISABILITY,
      PolicyTypeEnum.HOME,
      PolicyTypeEnum.AUTO,
    ]
  ): void {
    lines.forEach((line) => {
      scores[line] = Math.max(0, scores[line] - points);
    });
  }

  /**
   * Adds points to risk scores for the given lines of insurance
   * @param scores The risk scores to add points to
   * @param lines An array containing any combination of insurance policies
   * @param points The number of points to add
   * @private
   */
  private addRiskPoints(
    scores: RiskScores,
    lines: (
      | PolicyTypeEnum.LIFE
      | PolicyTypeEnum.DISABILITY
      | PolicyTypeEnum.HOME
      | PolicyTypeEnum.AUTO
    )[],
    points: number
  ): void {
    lines.forEach((line) => {
      scores[line] = Math.min(3, scores[line] + points);
    });
  }

  /**
   * Maps risk scores to a policy response
   * @param riskScores The risk scores to map
   * @private
   */
  private mapRiskScoresToPolicyResponse(
    riskScores: RiskScores
  ): PolicyResponse {
    return {
      auto: this.getPolicyScore(riskScores.auto),
      disability: this.getPolicyScore(riskScores.disability),
      home: this.getPolicyScore(riskScores.home),
      life: this.getPolicyScore(riskScores.life),
    };
  }

  /**
   * Maps a score number to a policy score enum
   * @param score The score to map
   * @private
   */
  private getPolicyScore(score: number): PolicyScoreEnum {
    if (score <= 0) {
      return PolicyScoreEnum.ECONOMIC;
    } else if (score <= 2) {
      return PolicyScoreEnum.REGULAR;
    } else {
      return PolicyScoreEnum.RESPONSIBLE;
    }
  }
}
