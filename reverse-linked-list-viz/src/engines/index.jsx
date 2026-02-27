// ═══════════════════════════════════════════════════════════════════
//  Engine Wrapper Components — Thin wrappers for the component registry
// ═══════════════════════════════════════════════════════════════════

import ArrayVizEngine from "./ArrayVizEngine";
import { twoSumConfig } from "./configs/twoSum";
import { moveZeroesConfig } from "./configs/moveZeroes";
import { containsDuplicateConfig } from "./configs/containsDuplicate";

// Each export is a simple component the registry can reference
export function EngTwoSum() { return <ArrayVizEngine config={twoSumConfig} />; }
export function EngMoveZeroes() { return <ArrayVizEngine config={moveZeroesConfig} />; }
export function EngContainsDuplicate() { return <ArrayVizEngine config={containsDuplicateConfig} />; }
