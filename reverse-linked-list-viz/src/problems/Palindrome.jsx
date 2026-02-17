import { useState, useEffect } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, StepInfo, VizLayout, VizCard, usePlayer, InputSection,
} from "../shared/Components";

const DEFAULT_WORD = "RACECAR";

const CODE = [
    { id: 0, text: `bool isPalin(string s, int l, int r) {` },
    { id: 1, text: `    if (l >= r)` },
    { id: 2, text: `        return true;  // base: done, it's a palindrome` },
    { id: 3, text: `` },
    { id: 4, text: `    if (s[l] != s[r])` },
    { id: 5, text: `        return false; // mismatch! not palindrome` },
    { id: 6, text: `` },
    { id: 7, text: `    return isPalin(s, l+1, r-1);` },
    { id: 8, text: `}` },
];

const PHASE_COLOR = {
    check: "#3b82f6", compare: "#f59e0b", match: "#10b981", mismatch: "#ef4444",
    recurse: "#8b5cf6", base: "#10b981", return: "#f59e0b", done: "#10b981", fail: "#ef4444",
};
const PHASE_LABELS = {
    check: "🔵 CHECK", match: "🟢 MATCH", mismatch: "🔴 MISMATCH",
    recurse: "🟣 RECURSE", base: "🟢 BASE CASE", return: "🟡 RETURN",
    done: "✅ DONE", fail: "❌ FAIL",
};

/* ── Dynamic step generator ── */
function generateSteps(word) {
    const s = word.toUpperCase();
    const steps = [];
    const callStack = [];

    function recurse(l, r) {
        callStack.push({ l, r });

        // check call
        steps.push({
            cl: 0, l, r, cs: callStack.map(c => ({ ...c })),
            vars: { l, r, "s[l]": s[l], "s[r]": s[r] },
            msg: `isPalin("${s}", l=${l}, r=${r}) called`,
            phase: "check",
        });

        // base case
        if (l >= r) {
            steps.push({
                cl: 1, l, r, cs: callStack.map(c => ({ ...c })),
                vars: { l, r, "l>=r": `${l}>=${r} → TRUE ✓` },
                msg: l === r ? `l=${l} = r=${r} → middle char, PALINDROME CONFIRMED!` : `l=${l} > r=${r} → crossed, PALINDROME CONFIRMED!`,
                phase: "base",
            });
            steps.push({
                cl: 2, l, r, cs: callStack.map(c => ({ ...c })),
                vars: { returning: "true" },
                msg: "return true ↑ — all characters matched!",
                phase: "base",
            });
            callStack.pop();
            return true;
        }

        // check base false
        steps.push({
            cl: 1, l, r, cs: callStack.map(c => ({ ...c })),
            vars: { l, r, "l>=r": `${l}>=${r} → false` },
            msg: `Check base: l=${l} >= r=${r}? No → continue`,
            phase: "check",
        });

        // compare
        if (s[l] !== s[r]) {
            steps.push({
                cl: 4, l, r, cs: callStack.map(c => ({ ...c })),
                vars: { [`s[${l}]`]: s[l], [`s[${r}]`]: s[r], "match?": `${s[l]}≠${s[r]} ✗` },
                msg: `Compare s[${l}]='${s[l]}' vs s[${r}]='${s[r]}' → MISMATCH ✗`,
                phase: "mismatch",
            });
            steps.push({
                cl: 5, l, r, cs: callStack.map(c => ({ ...c })),
                vars: { returning: "false" },
                msg: "return false immediately! Not a palindrome.",
                phase: "mismatch",
            });
            callStack.pop();
            return false;
        }

        // match
        steps.push({
            cl: 4, l, r, cs: callStack.map(c => ({ ...c })),
            vars: { [`s[${l}]`]: s[l], [`s[${r}]`]: s[r], "match?": `${s[l]}==${s[r]} ✓` },
            msg: `Compare s[${l}]='${s[l]}' vs s[${r}]='${s[r]}' → MATCH ✓`,
            phase: "match",
        });

        // recurse
        steps.push({
            cl: 7, l, r, cs: callStack.map(c => ({ ...c })),
            vars: { calling: `isPalin(${l + 1}, ${r - 1})` },
            msg: `Characters match! Recurse inward: isPalin(l+1=${l + 1}, r-1=${r - 1})`,
            phase: "recurse",
        });

        const result = recurse(l + 1, r - 1);

        // return
        callStack.push({ l, r });
        steps.push({
            cl: 7, l, r, cs: callStack.map(c => ({ ...c })),
            vars: { got: `${result} from isPalin(${l + 1},${r - 1})`, returning: `${result}` },
            msg: `isPalin(${l},${r}) gets ${result} → return ${result} ↑`,
            phase: "return",
        });
        callStack.pop();
        return result;
    }

    const result = recurse(0, s.length - 1);

    steps.push({
        cl: -1, l: -1, r: -1, cs: [], vars: {},
        msg: result
            ? `✅ "${s}" IS a palindrome! All pairs matched perfectly.`
            : `❌ "${s}" is NOT a palindrome!`,
        phase: result ? "done" : "fail",
    });

    return steps;
}

export default function Palindrome() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_WORD);
    const [word, setWord] = useState(DEFAULT_WORD);
    const [steps, setSteps] = useState(() => generateSteps(DEFAULT_WORD));
    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1500);
    const step = steps[Math.min(idx, steps.length - 1)];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";

    const chars = word.toUpperCase().split("");
    const n = chars.length;

    const confirmedPairs = [];
    const callDepth = step.cs.length;
    for (let i = 0; i < callDepth - 1; i++) {
        confirmedPairs.push({ l: i, r: n - 1 - i });
    }

    function handleRun() {
        const w = inputText.trim().toUpperCase();
        if (w.length === 0 || w.length > 20) return;
        setWord(w);
        const newSteps = generateSteps(w);
        setSteps(newSteps);
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_WORD);
        setWord(DEFAULT_WORD);
        setSteps(generateSteps(DEFAULT_WORD));
        setIdx(0);
        setPlaying(false);
    }

    return (
        <VizLayout
            title="Check Palindrome — Code ↔ Visual Sync"
            subtitle="Two-pointer recursion · compare outermost chars · move inward"
        >
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="RACECAR, HELLO, LEVEL, MADAM"
                label="String:"
            />

            {/* Top row: Code + right panels */}
            <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "900px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="palindrome.cpp" />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel
                        frames={step.cs}
                        renderFrame={(f) => `isPalin(l=${f.l}, r=${f.r})`}
                    />
                </div>
            </div>

            {/* String visualization */}
            <VizCard title="🔤 String Visualization — two-pointer approach" maxWidth="900px">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                        {chars.map((ch, i) => {
                            const isL = i === step.l;
                            const isR = i === step.r;
                            const isMatched = confirmedPairs.some(p => p.l === i || p.r === i);
                            const isDone = step.phase === "done" || step.phase === "fail";
                            const isPalin = step.phase === "done";

                            let bg = isDark ? "#1e293b" : "#e2e8f0";
                            let border = isDark ? "#1f2937" : "#cbd5e1";
                            let textColor = theme.textMuted;

                            if (isDone && isPalin) {
                                bg = "#065f46"; border = "#10b981"; textColor = "#34d399";
                            } else if (isDone && !isPalin) {
                                bg = "#450a0a"; border = "#ef4444"; textColor = "#f87171";
                            } else if (isL && isR) {
                                bg = "#1a3a1a"; border = "#10b981"; textColor = "#34d399";
                            } else if (isL || isR) {
                                bg = isDark ? "#1e1b4b" : "#e0e7ff"; border = pc; textColor = isDark ? "#a5b4fc" : "#4338ca";
                            } else if (isMatched) {
                                bg = isDark ? "#052e16" : "#dcfce7"; border = "#166534"; textColor = "#4ade80";
                            }

                            return (
                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <div style={{ height: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        {isL && !isR && <span style={{ fontSize: "9px", color: pc, fontWeight: "700" }}>l</span>}
                                        {isR && !isL && <span style={{ fontSize: "9px", color: pc, fontWeight: "700" }}>r</span>}
                                        {isL && isR && <span style={{ fontSize: "9px", color: "#10b981", fontWeight: "700" }}>l=r</span>}
                                    </div>
                                    <div style={{
                                        width: "42px", height: "42px", background: bg, border: `2px solid ${border}`,
                                        borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "18px", fontWeight: "800", color: textColor, transition: "all 0.35s",
                                        boxShadow: (isL || isR) && !isDone ? `0 0 12px ${pc}55` : "none",
                                    }}>
                                        {ch}
                                    </div>
                                    <span style={{ fontSize: "9px", color: isDark ? "#374151" : "#94a3b8" }}>[{i}]</span>
                                    <div style={{ height: "14px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        {isMatched && !isDone && <span style={{ fontSize: "10px", color: "#10b981" }}>✓</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {step.l >= 0 && step.r >= 0 && step.l !== step.r && (
                        <svg width={Math.max(chars.length * 48 + 20, 200)} height="40" style={{ overflow: "visible", marginTop: "-10px" }}>
                            {(() => {
                                const unit = 48;
                                const cx1 = step.l * unit + 21;
                                const cx2 = step.r * unit + 21;
                                const mid = (cx1 + cx2) / 2;
                                const arc = `M ${cx1} 5 Q ${mid} 42 ${cx2} 5`;
                                const isMatch = step.phase === "match";
                                const isMismatch = step.phase === "mismatch";
                                return (
                                    <g>
                                        <path d={arc} fill="none"
                                            stroke={isMismatch ? "#ef4444" : isMatch ? "#10b981" : pc}
                                            strokeWidth="2" strokeDasharray={isMatch || isMismatch ? "none" : "5 3"}
                                            style={{ filter: `drop-shadow(0 0 5px ${isMismatch ? "#ef444466" : isMatch ? "#10b98166" : pc + "44"})` }} />
                                        <text x={mid} y={36} textAnchor="middle" fontSize="9"
                                            fill={isMismatch ? "#ef4444" : isMatch ? "#10b981" : pc} fontWeight="700">
                                            {isMismatch ? "MISMATCH ✗" : isMatch ? "MATCH ✓" : "comparing..."}
                                        </text>
                                    </g>
                                );
                            })()}
                            {confirmedPairs.map((p, pidx) => {
                                if (p.l === p.r) return null;
                                const unit = 48;
                                const cx1 = p.l * unit + 21;
                                const cx2 = p.r * unit + 21;
                                const mid = (cx1 + cx2) / 2;
                                const arc = `M ${cx1} 5 Q ${mid} ${30 + pidx * 5} ${cx2} 5`;
                                return <path key={pidx} d={arc} fill="none" stroke="#166534" strokeWidth="1.5" opacity="0.5" />;
                            })}
                        </svg>
                    )}
                </div>
            </VizCard>

            {/* Recursion depth diagram */}
            <VizCard title="🔁 Recursion Depth — each call moves pointers inward" maxWidth="900px">
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {step.cs.map((frame, i) => {
                        const isTop = i === step.cs.length - 1;
                        const indent = i * 20;
                        const rangeChars = chars.map((ch, ci) =>
                            ci >= frame.l && ci <= frame.r
                                ? <span key={ci} style={{ color: isTop ? theme.textCodeActive : theme.textCode, fontWeight: isTop ? "700" : "400" }}>{ch}</span>
                                : <span key={ci} style={{ color: isDark ? "#1f2937" : "#e2e8f0" }}>·</span>
                        );
                        return (
                            <div key={i} style={{
                                marginLeft: `${indent}px`,
                                background: isTop ? theme.stackActiveBg : theme.stackBg,
                                border: `1px solid ${isTop ? theme.stackActiveBorder : theme.stackBorder}`,
                                borderRadius: "6px", padding: "5px 12px",
                                fontSize: "0.72rem", display: "flex", gap: "12px", alignItems: "center",
                            }}>
                                <span style={{ color: isTop ? "#818cf8" : theme.stackMuted, fontWeight: "700", minWidth: "130px" }}>
                                    isPalin(l={frame.l}, r={frame.r})
                                </span>
                                <span style={{ letterSpacing: "4px", fontFamily: "monospace" }}>{rangeChars}</span>
                                <span style={{ color: theme.stackMuted, fontSize: "0.62rem", marginLeft: "auto" }}>
                                    window: [{frame.l}..{frame.r}]
                                </span>
                            </div>
                        );
                    })}
                    {step.cs.length === 0 && (
                        <div style={{ color: theme.stackMuted, fontSize: "0.72rem" }}>Stack unwound — all frames returned</div>
                    )}
                </div>
            </VizCard>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />

            <StepInfo idx={idx} total={steps.length}>
                <span style={{ color: "#3b82f6" }}>■</span> checking &nbsp;
                <span style={{ color: "#10b981" }}>■</span> match &nbsp;
                <span style={{ color: "#ef4444" }}>■</span> mismatch &nbsp;
                <span style={{ color: "#8b5cf6" }}>■</span> recursing &nbsp;
                <span style={{ color: "#f59e0b" }}>■</span> returning
            </StepInfo>
        </VizLayout>
    );
}