import { singleton } from "tsyringe";
import { PolicyRequest } from "../models/interfaces/policy-request.interface";
import { PolicyResponse } from "../models/interfaces/policy-response.interface";
import { PolicyScoreEnum } from "../models/enums/policy-score.enum";
import { RiskScores } from "../models/interfaces/risk-scores.interface";
@singleton()
export class PolicyManager {
  constructor(
  ) {}

  public getRiskProfile(policyRequest: PolicyRequest): PolicyResponse {
    console.log(`Policy Request: ${JSON.stringify(policyRequest)}`);
    const  baseScore = this.getBaseScore(policyRequest.risk_questions);
    console.log(`Base scores are: ${JSON.stringify(baseScore)}`);
    const riskScores: RiskScores = {
      life: baseScore,
      disability: baseScore,
      home: baseScore,
      auto: baseScore
    };

    // Rule 1
    if (policyRequest.age < 30) {
      this.deductRiskPoints(riskScores, 2);
    } else if (policyRequest.age >= 30 && policyRequest.age <= 40) {
      this.deductRiskPoints(riskScores, 1);
    }

    // Rule 2
    if (policyRequest.income > 200000) {
      this.deductRiskPoints(riskScores, 1);
    }

    // Rule 3
    if (policyRequest.house.ownership_status === "mortgaged") {
      this.addRiskPoints(riskScores, ["home", "disability"], 1);
    }

    // Rule 4
    if (policyRequest.dependents > 0) {
      this.addRiskPoints(riskScores, ["disability", "life"], 1);
    }

    // Rule 5
    if (policyRequest.marital_status === "married") {
      this.addRiskPoints(riskScores, ["life"], 1);
      this.deductRiskPoints(riskScores, 1, ["disability"]);
    }

    // Rule 6
    const currentYear = new Date().getFullYear();
    if (policyRequest.vehicle.year >= currentYear - 5) {
      this.addRiskPoints(riskScores, ["auto"], 1);
    }
    console.log(`Risk scores after rules: ${JSON.stringify(riskScores)}`);
    let policyResponse: PolicyResponse = this.mapRiskScoresToPolicyResponse(riskScores);
    console.log(`Policy Response: ${JSON.stringify(policyResponse)}`);
    policyResponse = this.determineIneligibility(policyRequest, policyResponse);
    console.log(`Policy Response after ineligibility: ${JSON.stringify(policyResponse)}`);
    return policyResponse;
  }

  private getBaseScore(riskQuestions: number[]): number {
    const sum = riskQuestions.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(`Sum of risk questions: ${sum}`);
    return sum;
  }

  private determineIneligibility(policyRequest: PolicyRequest, policyResponse: PolicyResponse): PolicyResponse {
    if (policyRequest.income === 0) {
      policyResponse.disability = PolicyScoreEnum.INELIGIBLE;
    }
    if (policyRequest.vehicle === null) {
      policyResponse.auto = PolicyScoreEnum.INELIGIBLE;
    }
    if (policyRequest.house === null) {
      policyResponse.home = PolicyScoreEnum.INELIGIBLE;
    }
    if (policyRequest.age > 60) {
      policyResponse.disability = PolicyScoreEnum.INELIGIBLE;
      policyResponse.life = PolicyScoreEnum.INELIGIBLE;
    }
    return policyResponse;
  }

  private deductRiskPoints(
    scores: RiskScores,
    points: number,
    lines: ("life" | "disability" | "home" | "auto")[] = ["life", "disability", "home", "auto"]
  ): void {
    lines.forEach((line) => {
      scores[line] = Math.max(0, scores[line] - points);
    });
  }

  private addRiskPoints(scores: RiskScores, lines: ("life" | "disability" | "home" | "auto")[], points: number): void {
    lines.forEach((line) => {
      scores[line] = Math.min(3, scores[line] + points);
    });
  }

  private mapRiskScoresToPolicyResponse(riskScores: RiskScores): PolicyResponse {
    const policyResponse: PolicyResponse = {
      auto: this.getPolicyScore(riskScores.auto),
      disability: this.getPolicyScore(riskScores.disability),
      home: this.getPolicyScore(riskScores.home),
      life: this.getPolicyScore(riskScores.life),
    };

    return policyResponse;
  }

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
