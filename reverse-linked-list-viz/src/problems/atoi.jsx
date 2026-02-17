import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel,
    MessageBar, ControlBar, StepInfo, VizLayout, VizCard, usePlayer, InputSection,
} from "../shared/Components";

const DEFAULT_INPUT = "  -4193 with words";
const INT_MAX = 2147483647;
const INT_MIN = -2147483648;

const CODE = [
    { id: 0, text: `int myAtoi(string s) {` },
    { id: 1, text: `    int i = 0, sign = 1, result = 0;` },
    { id: 2, text: `    // Step 1: Skip whitespace` },
    { id: 3, text: `    while (s[i] == ' ') i++;` },
    { id: 4, text: `    // Step 2: Read sign` },
    { id: 5, text: `    if (s[i]=='-'||s[i]=='+') {` },
    { id: 6, text: `        sign = (s[i++]=='-') ? -1 : 1;` },
    { id: 7, text: `    }` },
    { id: 8, text: `    // Step 3: Read digits` },
    { id: 9, text: `    while (isdigit(s[i])) {` },
    { id: 10, text: `        result = result * 10 + (s[i]-'0');` },
    { id: 11, text: `        if (result*sign <= INT_MIN) return INT_MIN;` },
    { id: 12, text: `        if (result*sign >= INT_MAX) return INT_MAX;` },
    { id: 13, text: `        i++;` },
    { id: 14, text: `    }` },
    { id: 15, text: `    return result * sign;` },
    { id: 16, text: `}` },
];

const PHASE_COLOR = {
    init: "#6366f1", space: "#f59e0b", sign: "#ec4899", digit: "#3b82f6",
    clamp: "#ef4444", stop: "#94a3b8", return: "#f59e0b", done: "#10b981",
};
const PHASE_LABELS = {
    init: "⚙ INIT", space: "🟡 WHITESPACE", sign: "🟣 SIGN", digit: "🔵 DIGIT",
    clamp: "🔴 OVERFLOW CHECK", stop: "⬛ STOP", return: "🟠 RETURN", done: "✅ DONE",
};

/* ── Dynamic step generator ── */
function generateSteps(input) {
    const s = input;
    const steps = [];
    let i = 0, sign = 1, result = 0;

    // spaces info
    let spaceStart = 0, signIdx = -1;
    const digitIndices = [];

    // init
    steps.push({
        cl: 1, i: 0, sign: 1, result: 0, phase: "init",
        msg: "Initialize: i=0, sign=1, result=0", vars: { i: 0, sign: 1, result: 0 }
    });

    // skip whitespace
    while (i < s.length && s[i] === " ") {
        steps.push({
            cl: 3, i, sign, result, phase: "space",
            msg: `s[${i}]=' ' → whitespace! skip, i++`, vars: { i, "s[i]": "' '" }
        });
        i++;
    }
    if (i < s.length && s[i] !== " ") {
        if (s[i] !== "-" && s[i] !== "+" && isNaN(parseInt(s[i]))) {
            // not a sign or digit → stop
            steps.push({
                cl: 3, i, sign, result, phase: "stop",
                msg: `s[${i}]='${s[i]}' → not space/sign/digit → stop`, vars: { i, "s[i]": `'${s[i]}'` }
            });
        } else if (s[i] !== "-" && s[i] !== "+") {
            steps.push({
                cl: 3, i, sign, result, phase: "space",
                msg: `s[${i}]='${s[i]}' → not a space, done skipping`, vars: { i, "s[i]": `'${s[i]}'` }
            });
        }
    }

    // read sign
    if (i < s.length && (s[i] === "-" || s[i] === "+")) {
        signIdx = i;
        steps.push({
            cl: 5, i, sign, result, phase: "sign",
            msg: `s[${i}]='${s[i]}' → it's a sign character!`, vars: { i, "s[i]": `'${s[i]}'` }
        });
        sign = s[i] === "-" ? -1 : 1;
        i++;
        steps.push({
            cl: 6, i, sign, result, phase: "sign",
            msg: `sign = ${sign}, i++ → i=${i}`, vars: { i, sign }
        });
    } else if (i < s.length && s[i] !== " ") {
        // no sign found, still check
        steps.push({
            cl: 5, i, sign, result, phase: "sign",
            msg: `s[${i}]='${s[i]}' → not a sign, skip sign step`, vars: { i, "s[i]": `'${s[i]}'` }
        });
    }

    // read digits
    let clamped = false;
    while (i < s.length && !isNaN(parseInt(s[i]))) {
        const digit = parseInt(s[i]);
        digitIndices.push(i);

        steps.push({
            cl: 9, i, sign, result, phase: "digit",
            msg: `s[${i}]='${s[i]}' → isdigit? YES → process`, vars: { i, "s[i]": `'${s[i]}'` }
        });

        const prevResult = result;
        result = result * 10 + digit;
        steps.push({
            cl: 10, i, sign, result, phase: "digit",
            msg: `result = ${prevResult}×10 + ${digit} = ${result}`, vars: { result: `${prevResult}×10+${digit}=${result}`, "s[i]": `'${s[i]}'` }
        });

        // clamp check
        if (result * sign <= INT_MIN) {
            steps.push({
                cl: 11, i, sign, result, phase: "clamp",
                msg: `result×sign = ${result * sign} ≤ INT_MIN → CLAMPED!`, vars: { "result*sign": result * sign, "≤INT_MIN": "true → return INT_MIN" }
            });
            result = INT_MIN;
            sign = 1;
            clamped = true;
            break;
        }
        if (result * sign >= INT_MAX) {
            steps.push({
                cl: 12, i, sign, result, phase: "clamp",
                msg: `result×sign = ${result * sign} ≥ INT_MAX → CLAMPED!`, vars: { "result*sign": result * sign, "≥INT_MAX": "true → return INT_MAX" }
            });
            result = INT_MAX;
            sign = 1;
            clamped = true;
            break;
        }

        i++;
        steps.push({
            cl: 13, i, sign, result, phase: "digit",
            msg: `i++ → i=${i}`, vars: { i }
        });
    }

    if (!clamped && i < s.length) {
        steps.push({
            cl: 9, i, sign, result, phase: "stop",
            msg: `s[${i}]='${s[i] || ""}' → isdigit? NO → exit loop`, vars: { i, "s[i]": `'${s[i] || ""}'`, isdigit: "false → stop" }
        });
    }

    const finalAnswer = clamped ? result : result * sign;

    if (!clamped) {
        steps.push({
            cl: 15, i, sign, result, phase: "return",
            msg: `return result × sign = ${result} × ${sign} = ${finalAnswer}`,
            vars: { result, sign, answer: `${result} × ${sign} = ${finalAnswer}` }
        });
    }

    steps.push({
        cl: -1, i, sign: clamped ? 1 : sign, result: finalAnswer, phase: "done",
        msg: `✅ myAtoi("${s}") = ${finalAnswer}`, vars: { "final answer": finalAnswer }
    });

    return { steps, spaceEnd: signIdx >= 0 ? signIdx : (digitIndices[0] || i), signIdx, digitIndices };
}

export default function Atoi() {
    const { theme, isDark } = useTheme();
    const [inputText, setInputText] = useState(DEFAULT_INPUT);
    const [input, setInput] = useState(DEFAULT_INPUT);
    const [genResult, setGenResult] = useState(() => generateSteps(DEFAULT_INPUT));
    const { idx, setIdx, playing, setPlaying } = usePlayer(genResult.steps.length, 1400);
    const step = genResult.steps[idx];
    const pc = PHASE_COLOR[step.phase] || "#6366f1";
    const chars = input.split("");
    const digitSet = new Set(genResult.digitIndices);

    const processedDigits = genResult.steps.slice(0, idx + 1)
        .filter(s => s.phase === "digit" && s.cl === 10)
        .map(s => s.i);

    function handleRun() {
        const s = inputText;
        if (s.length === 0 || s.length > 20) return;
        setInput(s);
        setGenResult(generateSteps(s));
        setIdx(0);
        setPlaying(false);
    }
    function handleReset() {
        setInputText(DEFAULT_INPUT);
        setInput(DEFAULT_INPUT);
        setGenResult(generateSteps(DEFAULT_INPUT));
        setIdx(0);
        setPlaying(false);
    }

    function charType(ch, ci) {
        if (ci === step.i && step.phase !== "done") return "active";
        if (ch === " " && ci < genResult.spaceEnd) return "space";
        if ((ch === "-" || ch === "+") && ci === genResult.signIdx) return "sign";
        if (digitSet.has(ci)) return "digit";
        if (ci > (genResult.digitIndices[genResult.digitIndices.length - 1] || ci)) return "ignored";
        return "default";
    }

    const CHAR_STYLES_DARK = {
        active: { bg: "#1e1b4b", border: "#818cf8", text: "#c7d2fe" },
        space: { bg: "#292524", border: "#a16207", text: "#fbbf24" },
        sign: { bg: "#500724", border: "#ec4899", text: "#f9a8d4" },
        digit: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
        ignored: { bg: "#111827", border: "#1f2937", text: "#374151" },
        default: { bg: "#1e293b", border: "#1f2937", text: "#64748b" },
    };
    const CHAR_STYLES_LIGHT = {
        active: { bg: "#e0e7ff", border: "#818cf8", text: "#3730a3" },
        space: { bg: "#fef3c7", border: "#d97706", text: "#92400e" },
        sign: { bg: "#fce7f3", border: "#ec4899", text: "#9d174d" },
        digit: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
        ignored: { bg: "#f1f5f9", border: "#cbd5e1", text: "#94a3b8" },
        default: { bg: "#e2e8f0", border: "#cbd5e1", text: "#64748b" },
    };
    const CS = isDark ? CHAR_STYLES_DARK : CHAR_STYLES_LIGHT;

    // Build number trail from steps
    const digitTrail = [];
    let running = 0;
    for (const di of genResult.digitIndices) {
        const d = parseInt(input[di]);
        const prev = running;
        running = running * 10 + d;
        digitTrail.push({ digit: d, calc: `${prev}×10+${d}=${running}`, val: running, idx: di });
    }

    return (
        <VizLayout
            title="String to Integer (atoi) — Code ↔ Visual Sync"
            subtitle={`Input: "${input}" · Skip spaces → read sign → read digits → clamp`}
        >
            <InputSection
                value={inputText}
                onChange={setInputText}
                onRun={handleRun}
                onReset={handleReset}
                placeholder="  -4193 with words"
                label="String:"
            />

            <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="atoi.cpp" />
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <VariablesPanel vars={step.vars} />
                    <VizCard title="📊 State">
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                            <span style={{
                                background: `${pc}22`, border: `1px solid ${pc}44`, color: pc,
                                borderRadius: "5px", padding: "2px 8px", fontSize: "0.65rem",
                                fontWeight: "700", textTransform: "uppercase",
                            }}>{step.phase}</span>
                            <span style={{
                                background: isDark ? "#1e293b" : "#fce7f3", color: "#ec4899",
                                borderRadius: "5px", padding: "2px 8px", fontSize: "0.65rem", fontWeight: "700",
                            }}>sign: {step.sign === 1 ? "+1" : "-1"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ color: theme.textMuted, fontSize: "0.65rem" }}>result:</span>
                            <span style={{ color: "#f59e0b", fontSize: "0.9rem", fontWeight: "800" }}>{step.result}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ color: theme.textMuted, fontSize: "0.65rem" }}>→ value:</span>
                            <span style={{
                                color: step.phase === "done" ? "#34d399" : "#818cf8",
                                fontSize: "0.85rem", fontWeight: "800",
                            }}>{step.result * step.sign}</span>
                        </div>
                    </VizCard>
                </div>
            </div>

            {/* String visualization */}
            <VizCard title={`🔤 Input String — character-by-character scan (i = ${step.i})`} maxWidth="920px">
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "10px" }}>
                    {chars.map((ch, ci) => {
                        const isActive = ci === step.i && step.phase !== "done";
                        const type = charType(ch, ci);
                        const s = CS[isActive ? "active" : type] || CS.default;
                        const isDone = step.phase === "done";
                        const isProcessedDigit = processedDigits.includes(ci);

                        let bg = s.bg, border = s.border, textColor = s.text;
                        if (isDone && digitSet.has(ci)) { bg = "#065f46"; border = "#10b981"; textColor = "#34d399"; }
                        else if (isDone) { bg = isDark ? "#111827" : "#f1f5f9"; border = isDark ? "#1f2937" : "#e2e8f0"; textColor = isDark ? "#374151" : "#94a3b8"; }

                        return (
                            <div key={ci} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                <div style={{ height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {isActive && <span style={{ fontSize: "9px", color: pc, fontWeight: "700" }}>i</span>}
                                </div>
                                <div style={{
                                    width: "32px", height: "32px", background: bg,
                                    border: `2px solid ${isActive ? pc : border}`, borderRadius: "6px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "13px", fontWeight: "800", color: isActive ? (isDark ? "#fff" : "#1e1b4b") : textColor,
                                    transition: "all 0.3s", position: "relative",
                                    boxShadow: isActive ? `0 0 10px ${pc}66` : "none",
                                }}>
                                    {ch === " " ? "·" : ch}
                                    {isProcessedDigit && !isDone && (
                                        <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }} />
                                    )}
                                </div>
                                <span style={{ fontSize: "8px", color: isDark ? "#374151" : "#94a3b8" }}>[{ci}]</span>
                                <span style={{
                                    fontSize: "7px",
                                    color: type === "space" ? "#a16207" : type === "sign" ? "#ec4899" : type === "digit" ? "#3b82f6" : type === "ignored" ? (isDark ? "#1f2937" : "#cbd5e1") : "#334155",
                                }}>
                                    {type === "space" ? "SPC" : type === "sign" ? "SGN" : type === "digit" ? "NUM" : type === "ignored" ? "—" : ""}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {[
                        { color: "#f59e0b", label: "whitespace (skip)" },
                        { color: "#ec4899", label: "sign" },
                        { color: "#3b82f6", label: "digit (read)" },
                        { color: isDark ? "#374151" : "#94a3b8", label: "ignored (stop)" },
                    ].map(l => (
                        <span key={l.label} style={{ fontSize: "0.62rem", color: theme.textMuted, display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "8px", height: "8px", background: l.color, borderRadius: "2px", display: "inline-block" }} />
                            {l.label}
                        </span>
                    ))}
                </div>
            </VizCard>

            {/* Pipeline + Number builder */}
            <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "920px", flexWrap: "wrap" }}>
                <VizCard title="🔄 atoi Pipeline (4 Steps)">
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {[
                            {
                                id: "space", label: "1. Skip Whitespace", icon: "→",
                                done: ["sign", "digit", "clamp", "stop", "return", "done"].includes(step.phase),
                                active: step.phase === "space",
                                detail: step.phase === "space" ? `i=${step.i} skipping` : `skipped spaces`,
                                color: "#f59e0b"
                            },
                            {
                                id: "sign", label: "2. Read Sign", icon: "±",
                                done: ["digit", "clamp", "stop", "return", "done"].includes(step.phase),
                                active: step.phase === "sign",
                                detail: step.phase === "sign" ? `reading sign` : `sign = ${step.sign === 1 ? "+1" : "-1"}`,
                                color: "#ec4899"
                            },
                            {
                                id: "digit", label: "3. Read Digits", icon: "0-9",
                                done: ["stop", "return", "done"].includes(step.phase),
                                active: ["digit", "clamp"].includes(step.phase),
                                detail: ["digit", "clamp"].includes(step.phase) ? `result = ${step.result}` : `result = ${step.result}`,
                                color: "#3b82f6"
                            },
                            {
                                id: "return", label: "4. Apply Sign & Return", icon: "×",
                                done: step.phase === "done",
                                active: ["stop", "return"].includes(step.phase),
                                detail: step.phase === "done" ? `${step.result}` : `${step.result} × (${step.sign}) = ?`,
                                color: "#10b981"
                            },
                        ].map(p => (
                            <div key={p.id} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                background: p.active ? `${p.color}18` : p.done ? (isDark ? "#0a1a0a" : "#f0fdf4") : (isDark ? "#111827" : "#f8fafc"),
                                border: `1px solid ${p.active ? p.color : p.done ? "#166534" : theme.cardBorder}`,
                                borderRadius: "8px", padding: "7px 12px", transition: "all 0.3s",
                            }}>
                                <div style={{
                                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                                    background: p.active ? p.color : p.done ? "#065f46" : (isDark ? "#1e293b" : "#e2e8f0"),
                                    border: `2px solid ${p.active ? p.color : p.done ? "#10b981" : theme.cardBorder}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "9px", fontWeight: "800",
                                    color: p.active || p.done ? "#fff" : theme.textDim,
                                }}>{p.done && !p.active ? "✓" : p.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.7rem", fontWeight: "700", color: p.active ? p.color : p.done ? "#34d399" : theme.textDim }}>{p.label}</div>
                                    <div style={{ fontSize: "0.62rem", color: p.active ? theme.text : p.done ? "#4ade80" : (isDark ? "#1f2937" : "#cbd5e1") }}>{p.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </VizCard>

                {/* Dynamic number builder */}
                <VizCard title="🔢 Number Building (result = result × 10 + digit)">
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        {digitTrail.map((dt, di) => {
                            const reached = Math.abs(step.result) >= dt.val || (step.phase === "done" && genResult.digitIndices.length > 0);
                            const isNow = processedDigits.includes(dt.idx) && di === processedDigits.length - 1;
                            return (
                                <div key={di} style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    opacity: reached || isNow ? 1 : 0.2, transition: "opacity 0.4s",
                                }}>
                                    <div style={{
                                        width: "24px", height: "24px", borderRadius: "5px",
                                        background: isNow ? "#1e3a8a" : reached ? (isDark ? "#0c2340" : "#dbeafe") : (isDark ? "#111827" : "#f1f5f9"),
                                        border: `1px solid ${isNow ? "#3b82f6" : reached ? "#1d4ed8" : theme.cardBorder}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "12px", fontWeight: "800",
                                        color: isNow ? "#93c5fd" : reached ? "#60a5fa" : theme.textDim,
                                    }}>{dt.digit}</div>
                                    <span style={{ color: theme.textMuted, fontSize: "0.65rem", flex: 1 }}>{dt.calc}</span>
                                    <span style={{ color: isNow ? "#f59e0b" : reached ? "#1d4ed8" : (isDark ? "#1f2937" : "#e2e8f0"), fontWeight: "700", fontSize: "0.75rem" }}>
                                        = {dt.val}
                                    </span>
                                </div>
                            );
                        })}
                        {digitTrail.length > 0 && (
                            <>
                                <div style={{ borderTop: `1px solid ${theme.cardBorder}`, margin: "4px 0" }} />
                                <div style={{
                                    background: step.phase === "done" ? (isDark ? "#052e16" : "#dcfce7") : (isDark ? "#0f172a" : "#f8fafc"),
                                    border: `1px solid ${step.phase === "done" ? "#10b981" : theme.cardBorder}`,
                                    borderRadius: "8px", padding: "8px 12px",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <span style={{ color: theme.textMuted, fontSize: "0.65rem" }}>{digitTrail[digitTrail.length - 1].val} × ({step.sign}) =</span>
                                    <span style={{
                                        color: step.phase === "done" ? "#34d399" : step.phase === "return" ? "#f59e0b" : (isDark ? "#1e293b" : "#e2e8f0"),
                                        fontSize: "1.2rem", fontWeight: "800", transition: "color 0.4s",
                                    }}>
                                        {step.phase === "done" || step.phase === "return" ? step.result * step.sign : "?"}
                                    </span>
                                </div>
                            </>
                        )}
                        {digitTrail.length === 0 && (
                            <div style={{ color: theme.textMuted, fontSize: "0.7rem" }}>No digits found → result = 0</div>
                        )}
                    </div>
                </VizCard>
            </div>

            <MessageBar phase={step.phase} phaseLabel={PHASE_LABELS[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={genResult.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />

            <StepInfo idx={idx} total={genResult.steps.length}>
                <span style={{ color: "#f59e0b" }}>■</span> whitespace &nbsp;
                <span style={{ color: "#ec4899" }}>■</span> sign &nbsp;
                <span style={{ color: "#3b82f6" }}>■</span> digit &nbsp;
                <span style={{ color: "#ef4444" }}>■</span> overflow &nbsp;
                <span style={{ color: "#10b981" }}>■</span> done
            </StepInfo>
        </VizLayout>
    );
}