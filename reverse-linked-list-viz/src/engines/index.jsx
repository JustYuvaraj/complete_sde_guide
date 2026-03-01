// ═══════════════════════════════════════════════════════════════════
//  Engine Wrapper Components — Thin wrappers for the component registry
// ═══════════════════════════════════════════════════════════════════

import ArrayVizEngine from "./ArrayVizEngine";
import MatrixVizEngine from "./MatrixVizEngine";
import { twoSumConfig } from "./configs/twoSum";
import { moveZeroesConfig } from "./configs/moveZeroes";
import { containsDuplicateConfig } from "./configs/containsDuplicate";
import { validAnagramConfig } from "./configs/validAnagram";
import { groupAnagramsConfig } from "./configs/groupAnagrams";
import { topKFrequentConfig } from "./configs/topKFrequent";
import { productExceptSelfConfig } from "./configs/productExceptSelf";
import { longestConsecutiveConfig } from "./configs/longestConsecutive";

import { containsDuplicateIIConfig } from "./configs/containsDuplicateII";
import { ransomNoteConfig } from "./configs/ransomNote";
import { majorityElementConfig } from "./configs/majorityElement";
import { isomorphicStringsConfig } from "./configs/isomorphicStrings";
import { maxConsecutiveOnesConfig } from "./configs/maxConsecutiveOnes";

import { subarraySumConfig } from "./configs/subarraySum";
import { lengthOfLastWordConfig } from "./configs/lengthOfLastWord";
import { findIndexConfig } from "./configs/findIndex";
import { pascalsTriangleConfig } from "./configs/pascalsTriangle";
import { rotateArrayConfig } from "./configs/rotateArray";

import { firstMissingPositiveConfig } from "./configs/firstMissingPositive";
import { hIndexConfig } from "./configs/hIndex";
import { majorityElementIIConfig } from "./configs/majorityElementII";
import { findAnagramsConfig } from "./configs/findAnagrams";
import { decodeStringConfig } from "./configs/decodeString";

import { isAlienSortedConfig } from "./configs/isAlienSorted";
import { loggerRateLimiterConfig } from "./configs/loggerRateLimiter";
import { wordPatternConfig } from "./configs/wordPattern";

import { integerToRomanConfig } from "./configs/integerToRoman";
import { reverseWordsConfig } from "./configs/reverseWords";
import { zigzagConversionConfig } from "./configs/zigzagConversion";
import { myAtoiConfig } from "./configs/myAtoi";
import { countAndSayConfig } from "./configs/countAndSay";

import { compareVersionConfig } from "./configs/compareVersion";
import { encodeDecodeStringsConfig } from "./configs/encodeDecodeStrings";
import { nextPermutationConfig } from "./configs/nextPermutation";
import { largestNumberConfig } from "./configs/largestNumber";
import { insertDeleteGetRandomConfig } from "./configs/insertDeleteGetRandom";

import { gameOfLifeConfig } from "./configs/gameOfLife";
import { increasingTripletConfig } from "./configs/increasingTriplet";
import { longestMountainConfig } from "./configs/longestMountain";
import { maxPointsCardsConfig } from "./configs/maxPointsCards";
import { reorganizeStringConfig } from "./configs/reorganizeString";
import { diagonalTraverseConfig } from "./configs/diagonalTraverse";

import { validPalindromeConfig } from "./configs/validPalindrome";
import { twoSumIIConfig } from "./configs/twoSumII";
import { containerWithMostWaterConfig } from "./configs/containerWithMostWater";
import { isSubsequenceConfig } from "./configs/isSubsequence";

import { removeElementConfig } from "./configs/removeElement";
import { removeDuplicatesConfig } from "./configs/removeDuplicates";
import { removeDuplicatesIIConfig } from "./configs/removeDuplicatesII";
import { mergeSortedArrayConfig } from "./configs/mergeSortedArray";
import { sortColorsConfig } from "./configs/sortColors";

import { threeSumConfig } from "./configs/threeSum";
import { threeSumClosestConfig } from "./configs/threeSumClosest";
import { fourSumConfig } from "./configs/fourSum";
import { trappingRainWaterConfig } from "./configs/trappingRainWater";
import { zFunctionConfig } from "./configs/zFunction";
import { bestTimeToBuyAndSellStockConfig } from "./configs/bestTimeToBuyAndSellStock";
import { longestSubstringWithoutRepeatingConfig } from "./configs/longestSubstringWithoutRepeating";
import { longestRepeatingCharReplacementConfig } from "./configs/longestRepeatingCharReplacement";
import { permutationInStringConfig } from "./configs/permutationInString";
import { movingAverageConfig } from "./configs/movingAverage";
import { minimumSizeSubarraySumConfig } from "./configs/minimumSizeSubarraySum";
import { minimumWindowSubstringConfig } from "./configs/minimumWindowSubstring";
import { slidingWindowMaximumConfig } from "./configs/slidingWindowMaximum";
import { substringConcatenationConfig } from "./configs/substringConcatenation";
import { distinctNumbersSubarrayConfig } from "./configs/distinctNumbersSubarray";
import { dailyTemperaturesConfig } from "./configs/dailyTemperatures";
import { matrixDiagonalSumConfig } from "./configs/matrixDiagonalSum";
import { rotateImageConfig } from "./configs/rotateImage";
import { spiralMatrixConfig } from "./configs/spiralMatrix";
import { setMatrixZeroesConfig } from "./configs/setMatrixZeroes";
import StackVizEngine from "./StackVizEngine";

// Each export is a simple component the registry can reference
export function EngTwoSum(props) { return <ArrayVizEngine config={twoSumConfig} {...props} />; }
export function EngMoveZeroes(props) { return <ArrayVizEngine config={moveZeroesConfig} {...props} />; }
export function EngContainsDuplicate(props) { return <ArrayVizEngine config={containsDuplicateConfig} {...props} />; }
export function EngValidAnagram(props) { return <ArrayVizEngine config={validAnagramConfig} {...props} />; }
export function EngGroupAnagrams(props) { return <ArrayVizEngine config={groupAnagramsConfig} {...props} />; }
export function EngTopKFrequent(props) { return <ArrayVizEngine config={topKFrequentConfig} {...props} />; }
export function EngProductExceptSelf(props) { return <ArrayVizEngine config={productExceptSelfConfig} {...props} />; }
export function EngLongestConsecutive(props) { return <ArrayVizEngine config={longestConsecutiveConfig} {...props} />; }

export function EngContainsDuplicateII(props) { return <ArrayVizEngine config={containsDuplicateIIConfig} {...props} />; }
export function EngRansomNote(props) { return <ArrayVizEngine config={ransomNoteConfig} {...props} />; }
export function EngMajorityElement(props) { return <ArrayVizEngine config={majorityElementConfig} {...props} />; }
export function EngIsomorphicStrings(props) { return <ArrayVizEngine config={isomorphicStringsConfig} {...props} />; }
export function EngMaxConsecutiveOnes(props) { return <ArrayVizEngine config={maxConsecutiveOnesConfig} {...props} />; }

export function EngSubarraySum(props) { return <ArrayVizEngine config={subarraySumConfig} {...props} />; }
export function EngLengthOfLastWord(props) { return <ArrayVizEngine config={lengthOfLastWordConfig} {...props} />; }
export function EngFindIndex(props) { return <ArrayVizEngine config={findIndexConfig} {...props} />; }
export function EngPascalsTriangle(props) { return <ArrayVizEngine config={pascalsTriangleConfig} {...props} />; }
export function EngRotateArray(props) { return <ArrayVizEngine config={rotateArrayConfig} {...props} />; }

export function EngFirstMissingPositive(props) { return <ArrayVizEngine config={firstMissingPositiveConfig} {...props} />; }
export function EngHIndex(props) { return <ArrayVizEngine config={hIndexConfig} {...props} />; }
export function EngMajorityElementII(props) { return <ArrayVizEngine config={majorityElementIIConfig} {...props} />; }
export function EngFindAnagrams(props) { return <ArrayVizEngine config={findAnagramsConfig} {...props} />; }
export function EngDecodeString(props) { return <ArrayVizEngine config={decodeStringConfig} {...props} />; }

export function EngIsAlienSorted(props) { return <ArrayVizEngine config={isAlienSortedConfig} {...props} />; }
export function EngLoggerRateLimiter(props) { return <ArrayVizEngine config={loggerRateLimiterConfig} {...props} />; }
export function EngWordPattern(props) { return <ArrayVizEngine config={wordPatternConfig} {...props} />; }

export function EngIntegerToRoman(props) { return <ArrayVizEngine config={integerToRomanConfig} {...props} />; }
export function EngReverseWords(props) { return <ArrayVizEngine config={reverseWordsConfig} {...props} />; }
export function EngZigzagConversion(props) { return <ArrayVizEngine config={zigzagConversionConfig} {...props} />; }
export function EngMyAtoi(props) { return <ArrayVizEngine config={myAtoiConfig} {...props} />; }
export function EngCountAndSay(props) { return <ArrayVizEngine config={countAndSayConfig} {...props} />; }

export function EngCompareVersion(props) { return <ArrayVizEngine config={compareVersionConfig} {...props} />; }
export function EngEncodeDecodeStrings(props) { return <ArrayVizEngine config={encodeDecodeStringsConfig} {...props} />; }
export function EngNextPermutation(props) { return <ArrayVizEngine config={nextPermutationConfig} {...props} />; }
export function EngLargestNumber(props) { return <ArrayVizEngine config={largestNumberConfig} {...props} />; }
export function EngInsertDeleteGetRandom(props) { return <ArrayVizEngine config={insertDeleteGetRandomConfig} {...props} />; }

export function EngGameOfLife(props) { return <ArrayVizEngine config={gameOfLifeConfig} {...props} />; }
export function EngIncreasingTriplet(props) { return <ArrayVizEngine config={increasingTripletConfig} {...props} />; }
export function EngLongestMountain(props) { return <ArrayVizEngine config={longestMountainConfig} {...props} />; }
export function EngMaxPointsCards(props) { return <ArrayVizEngine config={maxPointsCardsConfig} {...props} />; }
export function EngReorganizeString(props) { return <ArrayVizEngine config={reorganizeStringConfig} {...props} />; }
export function EngDiagonalTraverse(props) { return <MatrixVizEngine config={diagonalTraverseConfig} {...props} />; }

export function EngValidPalindrome(props) { return <ArrayVizEngine config={validPalindromeConfig} {...props} />; }
export function EngTwoSumII(props) { return <ArrayVizEngine config={twoSumIIConfig} {...props} />; }
export function EngContainerWithMostWater(props) { return <ArrayVizEngine config={containerWithMostWaterConfig} {...props} />; }
export function EngIsSubsequence(props) { return <ArrayVizEngine config={isSubsequenceConfig} {...props} />; }

export function EngRemoveElement(props) { return <ArrayVizEngine config={removeElementConfig} {...props} />; }
export function EngRemoveDuplicates(props) { return <ArrayVizEngine config={removeDuplicatesConfig} {...props} />; }
export function EngRemoveDuplicatesII(props) { return <ArrayVizEngine config={removeDuplicatesIIConfig} {...props} />; }
export function EngMergeSortedArray(props) { return <ArrayVizEngine config={mergeSortedArrayConfig} {...props} />; }
export function EngSortColors(props) { return <ArrayVizEngine config={sortColorsConfig} {...props} />; }

export function EngThreeSum(props) { return <ArrayVizEngine config={threeSumConfig} {...props} />; }
export function EngThreeSumClosest(props) { return <ArrayVizEngine config={threeSumClosestConfig} {...props} />; }
export function EngFourSum(props) { return <ArrayVizEngine config={fourSumConfig} {...props} />; }
export function EngTrappingRainWater(props) { return <ArrayVizEngine config={trappingRainWaterConfig} {...props} />; }
export function EngZFunction(props) { return <ArrayVizEngine config={zFunctionConfig} {...props} />; }

// Sliding Window
export function EngBestTimeToBuyAndSellStock(props) { return <ArrayVizEngine config={bestTimeToBuyAndSellStockConfig} {...props} />; }
export function EngLongestSubstringWithoutRepeating(props) { return <ArrayVizEngine config={longestSubstringWithoutRepeatingConfig} {...props} />; }
export function EngLongestRepeatingCharReplacement(props) { return <ArrayVizEngine config={longestRepeatingCharReplacementConfig} {...props} />; }
export function EngPermutationInString(props) { return <ArrayVizEngine config={permutationInStringConfig} {...props} />; }
export function EngMovingAverage(props) { return <ArrayVizEngine config={movingAverageConfig} {...props} />; }
export function EngMinimumSizeSubarraySum(props) { return <ArrayVizEngine config={minimumSizeSubarraySumConfig} {...props} />; }
export function EngMinimumWindowSubstring(props) { return <ArrayVizEngine config={minimumWindowSubstringConfig} {...props} />; }
export function EngSlidingWindowMaximum(props) { return <ArrayVizEngine config={slidingWindowMaximumConfig} {...props} />; }
export function EngSubstringConcatenation(props) { return <ArrayVizEngine config={substringConcatenationConfig} {...props} />; }
export function EngDistinctNumbersSubarray(props) { return <ArrayVizEngine config={distinctNumbersSubarrayConfig} {...props} />; }
export function EngDailyTemperatures(props) { return <StackVizEngine config={dailyTemperaturesConfig} {...props} />; }
export function EngRotateImage(props) { return <MatrixVizEngine config={rotateImageConfig} {...props} />; }
export function EngSpiralMatrix(props) { return <MatrixVizEngine config={spiralMatrixConfig} {...props} />; }
export function EngSetMatrixZeroes(props) { return <MatrixVizEngine config={setMatrixZeroesConfig} {...props} />; }
export function EngMatrixDiagonalSum(props) { return <MatrixVizEngine config={matrixDiagonalSumConfig} {...props} />; }
