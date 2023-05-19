import { PolicyScoreEnum } from "../enums/policy-score.enum";

export interface PolicyResponse {
  auto: PolicyScoreEnum;
  disability: PolicyScoreEnum;
  home: PolicyScoreEnum;
  life: PolicyScoreEnum;
}
