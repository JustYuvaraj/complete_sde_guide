import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import {
    CodePanel, VariablesPanel, CallStackPanel,
    MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection,
    RecursionTreePanel,
} from "../shared/Components";

const CODE = [
    { id: 0, text: `void subsets(vector<int>& nums, int i,` },
    { id: 1, text: `             vector<int>& cur, vector<vector<int>>& res){` },
    { id: 2, text: `    if (i == nums.size()) {` },
    { id: 3, text: `        res.push_back(cur); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    // INCLUDE nums[i]` },
    { id: 6, text: `    cur.push_back(nums[i]);` },
    { id: 7, text: `    subsets(nums, i+1, cur, res);` },
    { id: 8, text: `    cur.pop_back();  // backtrack` },
    { id: 9, text: `    // EXCLUDE nums[i]` },
    { id: 10, text: `    subsets(nums, i+1, cur, res);` },
    { id: 11, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", include: "#3b82f6", exclude: "#f59e0b", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", include: "✅ INCLUDE", exclude: "⏭ EXCLUDE", back: "↩ BACK", done: "✅ DONE" };

function gen(nums) {
    const steps = [], cs = [], result = [], cur = [];
    const treeNodes = [];
    let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, current: [...cur], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) });

    function solve(i, parentId) {
        const myId = nid++;
        const myLabel = `i=${i} [${cur}]`;
        treeNodes.push({ id: `n${myId}`, label: myLabel, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`sub(i=${i})`);
        push(0, "call", { i, cur: `[${cur}]` }, `subsets(i=${i})`);

        if (i === nums.length) {
            result.push([...cur]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `{${cur}}`;
            push(3, "found", { cur: `[${cur}]`, "#": result.length }, `🎯 Found {${cur}}`);
            cs.pop(); return;
        }

        cur.push(nums[i]);
        treeNodes.find(t => t.id === `n${myId}`).status = "active";
        push(6, "include", { i, "nums[i]": nums[i], cur: `[${cur}]` }, `Include ${nums[i]}`);
        solve(i + 1, myId);

        cur.pop();
        cs.push(`sub(i=${i})`);
        push(8, "back", { i, cur: `[${cur}]` }, `Backtrack: rm ${nums[i]}`);

        push(10, "exclude", { i, "nums[i]": nums[i], cur: `[${cur}]` }, `Exclude ${nums[i]}`);
        solve(i + 1, myId);

        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} subsets`);
    return { steps, result };
}

function SubsetGrid({ step }) {
    return (
        <VizCard title={`📦 Subsets: ${(step.result || []).length}`}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "36px" }}>
                {(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`{${s.join(",")}}`}</span>))}
            </div>
        </VizCard>
    );
}

const DA = [1, 2, 3];
export default function Subsets() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 1 || a.length > 4) return; setSess(gen(a)); setIdx(0); setPlaying(false); };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false); };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Subsets" subtitle="Include / Exclude every element · LC #78">
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,2,3" label="Array (1–4 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="subsets.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <SubsetGrid step={step} />
                    <VariablesPanel vars={step.vars} />
                    <CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>📦 {sess.result.length} subsets</span></StepInfo>
        </VizLayout>
    );
}
