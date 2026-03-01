import { twoSumConfig } from "./src/engines/configs/twoSum.js";
import { validAnagramConfig } from "./src/engines/configs/validAnagram.js";
import { threeSumConfig } from "./src/engines/configs/threeSum.js";

function testEngine(config) {
    const generateSteps = config.generateSteps || function (...args) {
        const steps = [];
        if (config.generator) {
            const gen = config.generator(args);
            for (let val of gen) {
                steps.push(val);
            }
        }
        return steps;
    };

    const defaultsVals = Object.values(config.defaults || {});
    console.log(`[${config.title}] defaults:`, defaultsVals);

    try {
        const steps = generateSteps(...defaultsVals);
        console.log(`[${config.title}] Steps generated:`, steps.length);
        if (steps.length > 0) {
            const firstStep = steps[0];
            console.log(`[${config.title}] First step keys:`, Object.keys(firstStep));
        } else {
            console.error(`[${config.title}] FATAL: 0 steps generated!`);
        }
    } catch (e) {
        console.error(`[${config.title}] CRASH:`, e);
    }
}

console.log("Testing twoSum (new style)...");
testEngine(twoSumConfig);

console.log("\nTesting validAnagram (old style)...");
testEngine(validAnagramConfig);

console.log("\nTesting threeSum (old style)...");
testEngine(threeSumConfig);
