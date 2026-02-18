import { useState, useEffect, useRef } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel, MessageBar,
    ControlBar, VizLayout, InputSection, usePlayer, VizCard, StepInfo,
    ExplainPanel,
} from "../shared/Components";

// ── Code ─────────────────────────────────────────────────────────────
const CODE = [
    { id: 0, text: `int maxSub(int a[], int l, int r) {` },
    { id: 1, text: `    if (l == r) return a[l]; // base` },
    { id: 2, text: `` },
    { id: 3, text: `    int mid = (l + r) / 2;` },
    { id: 4, text: `    int L = maxSub(a, l, mid);` },
    { id: 5, text: `    int R = maxSub(a, mid+1, r);` },
    { id: 6, text: `    int X = maxCross(a, l, mid, r);` },
    { id: 7, text: `` },
    { id: 8, text: `    return max({L, R, X});` },
    { id: 9, text: `}` },
    { id: 10, text: `` },
    { id: 11, text: `int maxCross(int a[], int l, int m, int r){` },
    { id: 12, text: `    int ls=INT_MIN, s=0;` },
    { id: 13, text: `    for(int i=m; i>=l; i--) { // ← scan` },
    { id: 14, text: `        s+=a[i]; ls=max(ls,s);` },
    { id: 15, text: `    }` },
    { id: 16, text: `    int rs=INT_MIN; s=0;` },
    { id: 17, text: `    for(int j=m+1; j<=r; j++) { // → scan` },
    { id: 18, text: `        s+=a[j]; rs=max(rs,s);` },
    { id: 19, text: `    }` },
    { id: 20, text: `    return ls + rs;` },
    { id: 21, text: `}` },
];

const PHASE_COLOR = {
    call: "#8b5cf6", base: "#10b981", split: "#f59e0b",
    recurseL: "#3b82f6", recurseR: "#a855f7",
    cross: "#ec4899", scanL: "#06b6d4", scanR: "#f97316",
    return: "#10b981", done: "#10b981",
};

const PHASE_LABEL = {
    call: "📞 CALL", base: "🟢 BASE", split: "✂ SPLIT",
    recurseL: "⬅ RECURSE L", recurseR: "➡ RECURSE R",
    cross: "➕ CROSS", scanL: "🔵 SCAN ←", scanR: "🟠 SCAN →",
    return: "⬆ RETURN", done: "✅ DONE",
};

// ── Tree layout builder ───────────────────────────────────────────────
function buildTree(inputArr) {
    const n = inputArr.length;
    let nc = 0;
    const nodes = [], edges = [], nodeMap = {};
    let leafCtr = 0;

    function build(l, r, depth, pid) {
        const id = `N${nc++}`;
        nodeMap[`${l},${r}`] = id;
        const isLeaf = l >= r;
        nodes.push({ id, l, r, depth, leafX: isLeaf ? leafCtr++ : null });
        if (pid !== null) edges.push([pid, id]);
        if (!isLeaf) {
            const m = (l + r) >> 1;
            build(l, m, depth + 1, id);
            build(m + 1, r, depth + 1, id);
        }
    }
    build(0, n - 1, 0, null);

    const nLeaves = leafCtr;
    const maxD = Math.max(...nodes.map(nd => nd.depth));

    const avgLX = (l, r) => {
        const ls = nodes.filter(nd => nd.leafX !== null && nd.l >= l && nd.r <= r);
        return ls.length ? ls.reduce((s, nd) => s + nd.leafX, 0) / ls.length : 0;
    };

    nodes.forEach(nd => {
        const rx = nd.leafX !== null ? nd.leafX : avgLX(nd.l, nd.r);
        nd.x = nLeaves <= 1 ? 100 : 10 + (rx / (nLeaves - 1)) * 180;
        nd.y = maxD === 0 ? 80 : 18 + (nd.depth / maxD) * 130;
        const sl = inputArr.slice(nd.l, nd.r + 1);
        nd.shortLabel = sl.length <= 5 ? `[${sl.join(",")}]` : `[${sl.slice(0, 4).join(",")}…]`;
        nd.rangeLabel = `${nd.l}..${nd.r}`;
    });

    return { nodes, edges, nodeMap, nLeaves, maxD };
}

// ── Step generator ────────────────────────────────────────────────────
function generateSteps(inputArr, nodeMap) {
    const steps = [];
    const done = {};
    const nid = (l, r) => nodeMap[`${l},${r}`];
    const rng = (l, r) => Array.from({ length: r - l + 1 }, (_, i) => i + l);

    function push(s) {
        steps.push({ ...s, doneNodes: { ...done } });
    }

    function maxSub(l, r, stack) {
        const id = nid(l, r);
        const cs = [...stack, `maxSub(${l},${r})`];

        push({
            cl: 0, phase: "call", l, r, mid: null, hl: rng(l, r), activeNode: id, callStack: cs,
            cL: null, cR: null, scanI: null, lBest: null, rBest: null, xBest: null, winner: null,
            vars: { l, r, seg: `[${inputArr.slice(l, r + 1).join(",")}]` },
            msg: `maxSub(arr,${l},${r}) — searching max in [${inputArr.slice(l, r + 1).join(",")}]`
        });

        if (l === r) {
            done[id] = { sum: inputArr[l] };
            push({
                cl: 1, phase: "base", l, r, mid: null, hl: [l], activeNode: id, callStack: cs,
                cL: null, cR: null, scanI: null, lBest: null, rBest: null, xBest: null, winner: null,
                vars: { "l==r": "BASE CASE ✓", "a[l]": inputArr[l], return: inputArr[l] },
                msg: `BASE CASE: single element [${inputArr[l]}] → return ${inputArr[l]}`
            });
            return inputArr[l];
        }

        const mid = (l + r) >> 1;

        push({
            cl: 3, phase: "split", l, r, mid, hl: rng(l, r), activeNode: id, callStack: cs,
            cL: null, cR: null, scanI: null, lBest: null, rBest: null, xBest: null, winner: null,
            vars: { l, r, mid, "left": `[${l}..${mid}]`, "right": `[${mid + 1}..${r}]` },
            msg: `mid=${mid}. Left=[${inputArr.slice(l, mid + 1).join(",")}]  Right=[${inputArr.slice(mid + 1, r + 1).join(",")}]`
        });

        push({
            cl: 4, phase: "recurseL", l, r, mid, hl: rng(l, mid), activeNode: id, callStack: cs,
            cL: null, cR: null, scanI: null, lBest: null, rBest: null, xBest: null, winner: null,
            vars: { "→ recurse LEFT": `maxSub(${l},${mid})`, seg: `[${inputArr.slice(l, mid + 1).join(",")}]` },
            msg: `Recurse LEFT: maxSub(arr,${l},${mid}) on [${inputArr.slice(l, mid + 1).join(",")}]`
        });
        const L = maxSub(l, mid, cs);

        push({
            cl: 5, phase: "recurseR", l, r, mid, hl: rng(mid + 1, r), activeNode: id, callStack: cs,
            cL: null, cR: null, scanI: null, lBest: L, rBest: null, xBest: null, winner: null,
            vars: { "L (returned)": L, "→ recurse RIGHT": `maxSub(${mid + 1},${r})`, seg: `[${inputArr.slice(mid + 1, r + 1).join(",")}]` },
            msg: `Left returned ${L}. Now recurse RIGHT: maxSub(arr,${mid + 1},${r})`
        });
        const R = maxSub(mid + 1, r, cs);

        push({
            cl: 6, phase: "cross", l, r, mid, hl: rng(l, r), activeNode: id, callStack: cs,
            cL: mid, cR: mid + 1, scanI: null, lBest: L, rBest: R, xBest: null, winner: null,
            vars: { L, R, "→ maxCross": `l=${l} m=${mid} r=${r}` },
            msg: `L=${L} R=${R}. Now find max CROSSING subarray spanning mid=${mid} ↔ ${mid + 1}`
        });
        const X = maxCross(l, mid, r, cs, id, L, R);

        const best = Math.max(L, R, X);
        const winner = best === X && X >= L && X >= R ? "CROSS"
            : best === L && L >= R ? "LEFT" : "RIGHT";
        done[id] = { sum: best };

        push({
            cl: 8, phase: "return", l, r, mid, hl: rng(l, r), activeNode: id, callStack: cs,
            cL: null, cR: null, scanI: null, lBest: L, rBest: R, xBest: X, winner,
            vars: { L, R, X, winner, return: best },
            msg: `max(L=${L}, R=${R}, X=${X}) = ${best} ✓ ${winner} wins → return ${best}`
        });

        return best;
    }

    function maxCross(l, mid, r, cs, id, L, R) {
        let ls = -Infinity, s = 0, bestLi = mid;

        for (let i = mid; i >= l; i--) {
            s += inputArr[i];
            if (s > ls) { ls = s; bestLi = i; }
            push({
                cl: 13, phase: "scanL", l, r, mid, hl: rng(i, mid), activeNode: id, callStack: cs,
                cL: i, cR: mid + 1, scanI: i, lBest: L, rBest: R, xBest: null, winner: null,
                vars: { "i←": i, "a[i]": inputArr[i], "s": s, "ls": ls },
                msg: `Scan ←: i=${i}  a[i]=${inputArr[i]}  running s=${s}  best ls=${ls}`
            });
        }

        s = 0; let rs = -Infinity, bestRj = mid + 1;
        for (let j = mid + 1; j <= r; j++) {
            s += inputArr[j];
            if (s > rs) { rs = s; bestRj = j; }
            push({
                cl: 17, phase: "scanR", l, r, mid, hl: [...rng(bestLi, mid), ...rng(mid + 1, j)],
                activeNode: id, callStack: cs,
                cL: bestLi, cR: j, scanI: j, lBest: L, rBest: R, xBest: null, winner: null,
                vars: { "j→": j, "a[j]": inputArr[j], "s": s, "rs": rs, "ls": ls },
                msg: `Scan →: j=${j}  a[j]=${inputArr[j]}  running s=${s}  best rs=${rs}  cross=[${bestLi}..${j}]`
            });
        }

        const X = ls + rs;
        push({
            cl: 20, phase: "cross", l, r, mid, hl: rng(bestLi, bestRj), activeNode: id, callStack: cs,
            cL: bestLi, cR: bestRj, scanI: null, lBest: L, rBest: R, xBest: X, winner: null,
            vars: { ls, rs, "X=ls+rs": X, "window": `[${bestLi}..${bestRj}]` },
            msg: `Cross: ls=${ls}+rs=${rs}=${X}  window=[${inputArr.slice(bestLi, bestRj + 1).join(",")}]`
        });

        return X;
    }

    const total = maxSub(0, inputArr.length - 1, []);

    push({
        cl: -1, phase: "done", l: 0, r: inputArr.length - 1, mid: null,
        hl: rng(0, inputArr.length - 1), activeNode: null, callStack: [],
        cL: null, cR: null, scanI: null, lBest: null, rBest: null, xBest: null, winner: null,
        vars: { "MAX SUM": total, input: `[${inputArr.join(",")}]` },
        msg: `✅ Done! Maximum subarray sum = ${total}`
    });

    return { steps, total };
}

// ── Recursion Tree SVG ────────────────────────────────────────────────
function RecursionTree({ nodes, edges, activeNode, doneNodes }) {
    const { theme, isDark } = useTheme();
    if (!nodes.length) return null;

    const R = nodes.length > 14 ? 5 : nodes.length > 9 ? 6 : 7;
    const labelFz = nodes.length > 14 ? 4.5 : nodes.length > 9 ? 5 : 6;
    const statusFz = nodes.length > 14 ? 3.8 : nodes.length > 9 ? 4.2 : 5;

    const styleOf = id => {
        if (id === activeNode)
            return { fill: theme.stackActiveBg, stroke: theme.heroAccent, strokeW: "1.5", textC: theme.textCodeActive, pulse: true };
        const d = doneNodes[id];
        if (d !== undefined)
            return d.sum > 0
                ? { fill: isDark ? "#052e16" : "#dcfce7", stroke: "#22c55e", strokeW: "1", textC: isDark ? "#86efac" : "#166534", pulse: false }
                : d.sum === 0
                    ? { fill: isDark ? "#1c1917" : "#f5f5f5", stroke: "#78716c", strokeW: "1", textC: theme.textMuted, pulse: false }
                    : { fill: isDark ? "#450a0a" : "#fee2e2", stroke: "#ef4444", strokeW: "1", textC: isDark ? "#fca5a5" : "#991b1b", pulse: false };
        return { fill: theme.cardBg, stroke: theme.cardBorder, strokeW: "0.8", textC: theme.textMuted, pulse: false };
    };

    return (
        <svg viewBox="0 0 200 170" style={{ width: "100%", height: "100%" }}
            preserveAspectRatio="xMidYMid meet">
            {edges.map(([aid, bid]) => {
                const a = nodes.find(n => n.id === aid);
                const b = nodes.find(n => n.id === bid);
                if (!a || !b) return null;
                const active = activeNode === aid || activeNode === bid;
                const bothDone = doneNodes[aid] !== undefined && doneNodes[bid] !== undefined;
                return (
                    <line key={aid + bid}
                        x1={a.x} y1={a.y + R + 0.5}
                        x2={b.x} y2={b.y - R - 0.5}
                        stroke={active ? theme.heroAccent : bothDone ? "#166534" : theme.cardBorder}
                        strokeWidth={active ? "1.2" : "0.6"}
                    />
                );
            })}
            {nodes.map(nd => {
                const s = styleOf(nd.id);
                const isDone = doneNodes[nd.id] !== undefined;
                const sum = isDone ? doneNodes[nd.id].sum : null;
                return (
                    <g key={nd.id}>
                        {s.pulse && (
                            <circle cx={nd.x} cy={nd.y} r={R + 4}
                                fill="none" stroke={theme.heroAccent}
                                strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                        )}
                        <circle cx={nd.x} cy={nd.y} r={R}
                            fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeW} />
                        <text x={nd.x} y={nd.y - R - 3} textAnchor="middle"
                            fontSize={labelFz} fontFamily="'Fira Code', monospace"
                            fill={s.textC} fontWeight={s.pulse ? "700" : "500"}>
                            {nd.shortLabel}
                        </text>
                        <text x={nd.x} y={nd.y + labelFz * 0.38} textAnchor="middle"
                            fontSize={isDone ? statusFz + 0.5 : statusFz - 0.5}
                            fontFamily="'Fira Code', monospace"
                            fill={isDone ? (sum > 0 ? "#4ade80" : sum < 0 ? "#f87171" : "#a8a29e") : "#475569"}
                            fontWeight={isDone ? "700" : "400"}>
                            {isDone ? sum : nd.rangeLabel}
                        </text>
                    </g>
                );
            })}
            {[
                { x: 4, f: theme.stackActiveBg, s: theme.heroAccent, l: "active" },
                { x: 36, f: isDark ? "#052e16" : "#dcfce7", s: "#22c55e", l: "sum>0" },
                { x: 68, f: isDark ? "#450a0a" : "#fee2e2", s: "#ef4444", l: "sum<0" },
                { x: 100, f: theme.cardBg, s: theme.cardBorder, l: "pending" },
            ].map(d => (
                <g key={d.l}>
                    <circle cx={d.x + 3} cy={163} r={3.5} fill={d.f} stroke={d.s} strokeWidth="0.8" />
                    <text x={d.x + 8.5} y={164.5} fontSize="5" fontFamily="'Fira Code',monospace" fill="#64748b">
                        {d.l}
                    </text>
                </g>
            ))}
        </svg>
    );
}

// ── Array Bars (problem-specific viz) ─────────────────────────────────
function ArrayBars({ step, inputArr, maxAbs, crossWin, winHL }) {
    const { theme, isDark } = useTheme();

    return (
        <VizCard title="📊 Array — positive bars up · negative bars down · cyan=scan← · orange=scan→ · magenta=crossing">
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {inputArr.map((val, i) => {
                    const inRange = step.hl.includes(i);
                    const isCross = crossWin.includes(i);
                    const isWin = winHL.includes(i);
                    const isMid = i === step.mid && step.mid !== null;
                    const isScanL = step.phase === "scanL" && step.scanI !== null && i >= step.scanI && i <= (step.mid ?? 0);
                    const isScanR = step.phase === "scanR" && step.scanI !== null && i >= ((step.mid ?? 0) + 1) && i <= step.scanI;
                    const isActive = step.scanI === i;
                    const isDone = step.phase === "done";
                    const isPos = val >= 0;
                    const barH = Math.max(10, Math.round((Math.abs(val) / maxAbs) * 46));

                    let bg, border, shadow = "none", textCol = theme.text;
                    if (isDone) { bg = isDark ? "#065f46" : "#dcfce7"; border = "#10b981"; textCol = isDark ? "#34d399" : "#166534"; }
                    else if (isWin) { bg = isDark ? "#065f46" : "#dcfce7"; border = "#10b981"; textCol = isDark ? "#34d399" : "#166534"; shadow = "0 0 8px #22c55e55"; }
                    else if (isActive && isScanL) { bg = isDark ? "#0c4a5e" : "#cffafe"; border = "#06b6d4"; textCol = "#06b6d4"; shadow = "0 0 12px #06b6d466"; }
                    else if (isActive && isScanR) { bg = isDark ? "#431407" : "#ffedd5"; border = "#f97316"; textCol = "#f97316"; shadow = "0 0 12px #f9731666"; }
                    else if (isScanL) { bg = isDark ? "#042f3a" : "#ecfeff"; border = "#0e7490"; textCol = "#0e7490"; }
                    else if (isScanR) { bg = isDark ? "#2c1503" : "#fff7ed"; border = "#c2410c"; textCol = "#c2410c"; }
                    else if (isCross) { bg = isDark ? "#4a044e" : "#fdf4ff"; border = "#c026d3"; textCol = "#c026d3"; shadow = "0 0 6px #a855f733"; }
                    else if (inRange) { bg = isDark ? "#1e1b4b" : "#e0e7ff"; border = "#4f46e5"; }
                    else { bg = isDark ? "#0a0a0f" : "#f1f5f9"; border = isDark ? "#1e293b" : "#cbd5e1"; textCol = theme.textMuted; }

                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <div style={{ height: "13px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                {isMid && <span style={{ fontSize: "6px", color: "#f59e0b", fontWeight: "800" }}>MID</span>}
                                {isActive && isScanL && <span style={{ fontSize: "6px", color: "#06b6d4", fontWeight: "800" }}>i←</span>}
                                {isActive && isScanR && <span style={{ fontSize: "6px", color: "#f97316", fontWeight: "800" }}>j→</span>}
                                {isWin && !isActive && !isMid && <span style={{ fontSize: "6px", color: "#22c55e", fontWeight: "800" }}>★</span>}
                            </div>
                            <div style={{ height: "46px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                {isPos
                                    ? <div style={{
                                        width: "100%", height: `${barH}px`, background: bg,
                                        border: `2px solid ${border}`, borderRadius: "3px 3px 0 0",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.3s", boxShadow: shadow
                                    }}>
                                        <span style={{ fontSize: "9px", fontWeight: "800", color: textCol }}>{val}</span>
                                    </div>
                                    : <div style={{ width: "100%", height: "1px", background: "#1e293b" }} />}
                            </div>
                            <div style={{
                                width: "100%", height: "2px",
                                background: isMid ? "#f59e0b" : theme.cardBorder, flexShrink: 0
                            }} />
                            <div style={{ height: "46px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                {!isPos
                                    ? <div style={{
                                        width: "100%", height: `${barH}px`, background: bg,
                                        border: `2px solid ${border}`, borderRadius: "0 0 3px 3px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.3s", boxShadow: shadow
                                    }}>
                                        <span style={{ fontSize: "9px", fontWeight: "800", color: textCol }}>{val}</span>
                                    </div>
                                    : <div style={{ width: "100%", height: "1px", background: theme.cardBorder }} />}
                            </div>
                            <span style={{ fontSize: "7px", color: inRange ? theme.text : theme.textMuted, marginTop: "2px" }}>[{i}]</span>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "9px", flexWrap: "wrap", marginTop: "5px" }}>
                {[
                    { c: "#4f46e5", l: "active range" }, { c: "#06b6d4", l: "scan← (left)" },
                    { c: "#f97316", l: "scan→ (right)" }, { c: "#a855f7", l: "crossing" },
                    { c: "#22c55e", l: "winner ★" }, { c: "#f59e0b", l: "mid" },
                ].map(x => (
                    <span key={x.l} style={{
                        display: "flex", alignItems: "center", gap: "3px",
                        fontSize: "0.58rem", color: theme.textMuted
                    }}>
                        <span style={{
                            width: "7px", height: "7px", background: x.c,
                            borderRadius: "2px", display: "inline-block"
                        }} />
                        {x.l}
                    </span>
                ))}
            </div>
        </VizCard>
    );
}

// ── Candidates Panel (problem-specific) ───────────────────────────────
function CandidatesPanel({ step, total }) {
    const { theme, isDark } = useTheme();
    return (
        <VizCard title="⚖ Candidates — every subarray is purely LEFT, purely RIGHT, or CROSSES mid">
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                <div style={{
                    padding: "8px 14px", background: isDark ? "#0f172a" : "#f8fafc",
                    border: `2px solid ${step.phase === "done" ? "#22c55e" : theme.cardBorder}`,
                    borderRadius: "10px", textAlign: "center", flexShrink: 0, minWidth: "68px"
                }}>
                    <div style={{ fontSize: "0.55rem", color: theme.textMuted, marginBottom: "2px" }}>BEST</div>
                    <div style={{
                        fontSize: "2rem", fontWeight: "900",
                        color: step.phase === "done" ? "#4ade80" : "#818cf8", transition: "all 0.3s"
                    }}>
                        {total}
                    </div>
                </div>

                {[
                    { label: "L  left", val: step.lBest, color: "#3b82f6", key: "LEFT" },
                    { label: "R  right", val: step.rBest, color: "#a855f7", key: "RIGHT" },
                    { label: "X  cross", val: step.xBest, color: "#ec4899", key: "CROSS" },
                ].map(c => {
                    const has = c.val !== null;
                    const isWin = step.winner === c.key;
                    return (
                        <div key={c.label} style={{
                            flex: 1, padding: "6px 10px", borderRadius: "8px",
                            background: isWin ? (isDark ? "#0a2010" : "#dcfce7") : has ? (isDark ? "#0d1117" : "#f1f5f9") : theme.bg,
                            border: `1.5px solid ${isWin ? "#22c55e" : has ? c.color : theme.cardBorder}`,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: "2px",
                            transition: "all 0.35s",
                            boxShadow: isWin ? "0 0 12px #22c55e33" : has ? `0 0 6px ${c.color}22` : "none"
                        }}>
                            <span style={{ fontSize: "0.58rem", color: has ? c.color : theme.textDim, fontWeight: "700" }}>
                                {c.label}
                            </span>
                            <span style={{
                                fontSize: "1.4rem", fontWeight: "900",
                                color: isWin ? "#4ade80" : has ? c.color : theme.textDim
                            }}>
                                {has ? c.val : "—"}
                            </span>
                            {isWin && (
                                <span style={{ fontSize: "0.56rem", color: "#4ade80", fontWeight: "700" }}>★ WINNER</span>
                            )}
                        </div>
                    );
                })}

                <div style={{
                    flex: "0 0 110px", fontSize: "0.57rem", color: theme.text,
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: "3px",
                    paddingLeft: "4px"
                }}>
                    <div style={{ color: theme.textMuted, fontWeight: "700", marginBottom: "1px" }}>Key insight:</div>
                    <div>Any subarray lies in <span style={{ color: "#3b82f6" }}>LEFT</span>,</div>
                    <div><span style={{ color: "#a855f7" }}>RIGHT</span>, or</div>
                    <div><span style={{ color: "#ec4899" }}>CROSSES mid</span>.</div>
                    <div style={{ marginTop: "3px", color: theme.textMuted }}>→ return max(L,R,X)</div>
                </div>
            </div>
        </VizCard>
    );
}

// ── App ───────────────────────────────────────────────────────────────
const EXPLAIN = [
    {
        icon: "🤔", title: "How to Think", color: "#8b5cf6",
        content: `## The Problem
Find the contiguous subarray with the **largest sum**. E.g., [-2,1,-3,4,-1,2,1,-5] → 6 (subarray [4,-1,2,1]).

## Divide & Conquer Approach
Split array in half. Max subarray is in:
1. **Left half** only
2. **Right half** only
3. **Crosses the middle** (extends both sides)

Answer = max of all three.

**Think of it like:** Splitting a rope in half. The strongest section is either entirely left, entirely right, or spans the middle.`
    },
    {
        icon: "📝", title: "Algorithm", color: "#3b82f6",
        content: `## Step-by-Step

1. Split array at mid
2. Recursively solve left half and right half
3. Find max crossing sum:
   - Extend left from mid: best sum going left
   - Extend right from mid+1: best sum going right
   - Cross sum = left + right
4. Return max(leftMax, rightMax, crossMax)

### Also: Kadane's Algorithm (O(n))
    maxHere = max(num, maxHere + num)
    maxSoFar = max(maxSoFar, maxHere)
Simpler but this viz shows divide & conquer.`
    },
    {
        icon: "💻", title: "Code Logic", color: "#10b981",
        content: `## Key Points

### Cross Sum Calculation
From mid, extend left summing elements. Track max.
From mid+1, extend right summing elements. Track max.
Cross = leftMax + rightMax.

### Base Case
    if (l == r) return arr[l];
Single element is its own max subarray.

### Why D&C when Kadane's is simpler?
D&C teaches the paradigm. Same idea applies to merge sort, closest pair, etc.

## Time & Space Complexity
- **Time:** O(n log n) for D&C, O(n) for Kadane's
- **Space:** O(log n) recursion depth`
    },
];

const DEFAULT = [-2, 1, -3, 4, -1, 2, 1, -5];

export default function MaxSubarray() {
    const { theme, isDark } = useTheme();
    const [inputArr, setInputArr] = useState(DEFAULT);
    const [inputText, setInputText] = useState(DEFAULT.join(","));
    const [session, setSession] = useState(null);
    const { idx, setIdx, playing, setPlaying } = usePlayer(session?.steps?.length || 1, 1100);

    useEffect(() => {
        try {
            const tree = buildTree(inputArr);
            const { steps, total } = generateSteps(inputArr, tree.nodeMap);
            setSession({ ...tree, steps, total });
            setIdx(0);
            setPlaying(false);
        } catch (e) { console.error(e); }
    }, [inputArr]);

    function handleRun() {
        const nums = inputText.split(/[\s,]+/).map(s => parseInt(s, 10)).filter(n => !isNaN(n));
        if (nums.length < 2 || nums.length > 8) return;
        setInputArr(nums);
        setInputText(nums.join(","));
    }
    function handleReset() {
        setInputText(DEFAULT.join(","));
        setInputArr(DEFAULT);
    }

    if (!session) return (
        <div style={{
            background: theme.bg, height: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: theme.heroAccent, fontFamily: "monospace"
        }}>Computing…</div>
    );

    const { nodes, edges, steps, total } = session;
    const step = steps[Math.min(idx, steps.length - 1)];
    const totalS = steps.length;
    const pc = PHASE_COLOR[step.phase] || theme.heroAccent;
    const maxAbs = Math.max(...inputArr.map(Math.abs), 1);

    const crossWin = (step.cL !== null && step.cR !== null)
        ? Array.from({ length: step.cR - step.cL + 1 }, (_, i) => i + step.cL)
        : [];

    const getWinHL = () => {
        if (!step.winner || step.mid === null) return [];
        if (step.winner === "LEFT") return Array.from({ length: step.mid - step.l + 1 }, (_, i) => i + step.l);
        if (step.winner === "RIGHT") return Array.from({ length: step.r - step.mid }, (_, i) => i + step.mid + 1);
        if (step.winner === "CROSS") return crossWin;
        return [];
    };
    const winHL = getWinHL();

    return (
        <VizLayout title="Maximum Subarray" subtitle="Divide & Conquer · O(n log n)">
            <ExplainPanel sections={EXPLAIN} />
            <InputSection value={inputText} onChange={setInputText} onRun={handleRun} onReset={handleReset}
                placeholder="-2,1,-3,4,-1,2" label="Array:" />

            {/* MAIN GRID */}
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "960px", flexWrap: "wrap", alignItems: "flex-start" }}>
                {/* Code Panel */}
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="max_subarray.cpp" />

                {/* Right side */}
                <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <ArrayBars step={step} inputArr={inputArr} maxAbs={maxAbs} crossWin={crossWin} winHL={winHL} />

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "2 1 300px" }}>
                            <CandidatesPanel step={step} total={total} />
                        </div>
                        <div style={{ flex: "1 1 150px" }}>
                            <VariablesPanel vars={step.vars} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "0 0 175px" }}>
                            <CallStackPanel
                                frames={step.callStack || []}
                                emptyText={step.phase === "done" ? "✅ complete" : "—"}
                            />
                        </div>
                        <VizCard title="🌳 Live Recursion Tree">
                            <div style={{ minHeight: "120px" }}>
                                <RecursionTree nodes={nodes} edges={edges}
                                    activeNode={step.activeNode} doneNodes={step.doneNodes} />
                            </div>
                        </VizCard>
                    </div>
                </div>
            </div>

            <MessageBar phase={step.phase}
                phaseLabel={PHASE_LABEL[step.phase] || step.phase}
                msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={totalS} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={totalS}>
                <span style={{ color: "#818cf8", fontWeight: 700 }}>🏆 max sum = {total}</span>
            </StepInfo>
        </VizLayout>
    );
}
