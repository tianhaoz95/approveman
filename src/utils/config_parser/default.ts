/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */

export const getDefaultOwnershipRules = (): OwnershipRules => {
  const ownershipRules: OwnershipRules = {
    directoryMatchingRules: [
      {
        name: "Default matching rule",
        path: "playground/{{username}}/**/*",
      },
    ],
  };
  return ownershipRules;
};
