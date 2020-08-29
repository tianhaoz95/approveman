import { OwnershipRules } from "../types"; // eslint-disable-line no-unused-vars

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
