import { useState } from "react";
import { useTheme } from "../shared/ThemeContext";
import { CodePanel, VariablesPanel, CallStackPanel, MessageBar, ControlBar, VizCard, StepInfo, VizLayout, usePlayer, InputSection, RecursionTreePanel } from "../shared/Components";

const CODE = [
    { id: 0, text: `void permute(vector<int>& nums, int start,` },
    { id: 1, text: `             vector<vector<int>>& res) {` },
    { id: 2, text: `    if (start == nums.size()) {` },
    { id: 3, text: `        res.push_back(nums); return;` },
    { id: 4, text: `    }` },
    { id: 5, text: `    for (int i = start; i < nums.size(); i++){` },
    { id: 6, text: `        swap(nums[start], nums[i]);` },
    { id: 7, text: `        permute(nums, start+1, res);` },
    { id: 8, text: `        swap(nums[start], nums[i]);` },
    { id: 9, text: `    }` },
    { id: 10, text: `}` },
];
const PC = { call: "#8b5cf6", found: "#10b981", swap: "#3b82f6", back: "#ec4899", done: "#10b981" };
const PL = { call: "📞 CALL", found: "🎯 FOUND", swap: "🔄 SWAP", back: "↩ UNSWAP", done: "✅ DONE" };

function gen(nums) {
    const arr = [...nums], steps = [], cs = [], result = [];
    const treeNodes = []; let nid = 0;
    const push = (cl, ph, v, m) => steps.push({ cl, phase: ph, vars: { ...v }, callStack: [...cs], msg: m, arr: [...arr], result: result.map(r => [...r]), treeNodes: treeNodes.map(t => ({ ...t })) });
    function solve(start, parentId) {
        const myId = nid++;
        treeNodes.push({ id: `n${myId}`, label: `[${arr}] s=${start}`, parentId: parentId != null ? `n${parentId}` : null, status: "active" });
        cs.push(`p(s=${start})`);
        push(0, "call", { start, arr: `[${arr}]` }, `permute(start=${start})`);
        if (start === arr.length) {
            result.push([...arr]);
            treeNodes.find(t => t.id === `n${myId}`).status = "found";
            treeNodes.find(t => t.id === `n${myId}`).label = `[${arr}]`;
            push(3, "found", { perm: `[${arr}]`, "#": result.length }, `🎯 Permutation #${result.length}`);
            cs.pop(); return;
        }
        for (let i = start; i < arr.length; i++) {
            [arr[start], arr[i]] = [arr[i], arr[start]];
            push(6, "swap", { i, start, "swap": `${arr[i]}↔${arr[start]}`, arr: `[${arr}]` }, `swap(${start},${i})`);
            solve(start + 1, myId);
            [arr[start], arr[i]] = [arr[i], arr[start]];
            cs.push(`p(s=${start})`);
            push(8, "back", { i, arr: `[${arr}]` }, `unswap(${start},${i})`);
            cs.pop();
        }
        treeNodes.find(t => t.id === `n${myId}`).status = "done";
        cs.pop();
    }
    solve(0, null);
    push(0, "done", { total: result.length }, `✅ ${result.length} permutations`);
    return { steps, result };
}

const DA = [1, 2, 3];
export default function Permutations() {
    const [aT, setAT] = useState(DA.join(","));
    const [sess, setSess] = useState(() => gen(DA));
    const { idx, setIdx, playing, setPlaying } = usePlayer(sess.steps.length, 900);
    const run = () => { const a = aT.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n)); if (a.length < 2 || a.length > 4) return; setSess(gen(a)); setIdx(0); setPlaying(false) };
    const reset = () => { setAT(DA.join(",")); setSess(gen(DA)); setIdx(0); setPlaying(false) };
    const step = sess.steps[Math.min(idx, sess.steps.length - 1)], pc = PC[step.phase] || "#8b5cf6";
    return (
        <VizLayout title="Permutations" subtitle="Swap-based backtracking · n! paths · LC #46">
            <InputSection value={aT} onChange={setAT} onRun={run} onReset={reset} placeholder="1,2,3" label="Array (2–4 el):" />
            <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "920px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <CodePanel code={CODE} activeLineId={step.cl} accentColor={pc} fileName="permutations.cpp" />
                <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                    <VizCard title={`🔢 Perms: ${(step.result || []).length}`}><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", minHeight: "30px" }}>{(step.result || []).map((s, i) => (<span key={i} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600, background: "#052e16", border: "1.5px solid #10b981", color: "#4ade80" }}>{`[${s.join(",")}]`}</span>))}</div></VizCard>
                    <VariablesPanel vars={step.vars} /><CallStackPanel frames={step.callStack} />
                </div>
            </div>
            <RecursionTreePanel nodes={step.treeNodes} />
            <MessageBar phase={step.phase} phaseLabel={PL[step.phase] || step.phase} msg={step.msg} accentColor={pc} />
            <ControlBar idx={idx} total={sess.steps.length} playing={playing} setPlaying={setPlaying} setIdx={setIdx} />
            <StepInfo idx={idx} total={sess.steps.length}><span style={{ color: "#10b981", fontWeight: 700 }}>🔢 {sess.result.length} perms</span></StepInfo>
        </VizLayout>
    );
}
