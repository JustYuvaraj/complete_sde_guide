import React, { useState } from "react";
import { SplitVizLayout } from "../shared/SplitVizLayout";
import { ExplainPanel, VariablesPanel, usePlayer, ProgressBar, CodeEditorPanel, VizCard, VariableGuide } from "../shared/Components";
import { useTheme } from "../shared/ThemeContext";
import PracticeEditor from "../components/PracticeEditor";

export default function MatrixVizEngine({ config, isPracticeMode, setIsPracticeMode, headerRightItem, problemConfig }) {
    const { isDark, theme } = useTheme();

    const args = Object.values(config.defaults || {});
    // ── Pre-calculate steps from generator ──
    const [steps] = useState(() => {
        if (config.steps) return config.steps;
        if (config.generator) {
            const gen = config.generator(args);
            return [...gen];
        }
        return [];
    });

    const { idx, setIdx, playing, setPlaying } = usePlayer(steps.length, 1400);
    const step = steps[idx];

    const subtitleText = typeof config.subtitle === "function" ? config.subtitle(args) : config.subtitle;

    if (!step) return (
        <div style={{ padding: '40px', textAlign: 'center', color: theme.textDim }}>
            No visualization steps available.
        </div>
    );

    const matrix = step.matrix || config.input || [];
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;

    const activeCell = step.activeCell || { r: -1, c: -1 };
    const visited = step.visited || [];
    const hlRows = step.hlRows || [];
    const hlCols = step.hlCols || [];

    const isVisited = (r, c) => {
        if (Array.isArray(visited?.[0])) return visited[r][c];
        return visited.some(v => v.r === r && v.c === c);
    };

    const getCellColor = (r, c) => {
        if (r === activeCell.r && c === activeCell.c) return "#818cf8";
        if (hlRows.includes(r) || hlCols.includes(c)) return "#ef4444";
        if (isVisited(r, c)) return "#10b981";
        return null;
    };

    return (
        <SplitVizLayout
            title={config.title}
            subtitle={subtitleText}
            fullRight={isPracticeMode}
            headerRightItem={headerRightItem}
            leftPanel={
                <>
                    <ExplainPanel sections={config.explain} />
                    <div style={{ marginTop: '24px' }}>
                        <VariablesPanel vars={step.vars} />
                    </div>
                    <CodeEditorPanel
                        code={(config.code || []).map((c, i) => typeof c === 'string' ? { id: i, text: c } : c)}
                        step={step}
                        fileName={config.fileName || "solution.py"}
                        idx={idx}
                        setIdx={setIdx}
                        steps={steps}
                        playing={playing}
                        setPlaying={setPlaying}
                        accentColor="#818cf8"
                    />
                </>
            }
            rightPanel={
                isPracticeMode ? (
                    <PracticeEditor
                        config={config}
                        onClose={() => setIsPracticeMode(false)}
                        embedded={true}
                    />
                ) : (
                    <div style={{
                        height: '100%', width: '100%', position: 'relative',
                        display: 'flex', flexDirection: 'column', padding: '40px',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <VizCard title="📊 Matrix Desktop">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `30px repeat(${cols}, 60px)`,
                                gap: '8px',
                                padding: '24px',
                                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                borderRadius: '20px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {/* Column Headers */}
                                <div style={{ width: '30px' }} />
                                {Array.from({ length: cols }).map((_, c) => (
                                    <div key={`col-${c}`} style={{
                                        textAlign: 'center', fontSize: '0.7rem', fontWeight: '800',
                                        color: activeCell.c === c ? "#818cf8" : theme.textDim,
                                        fontFamily: 'monospace'
                                    }}>C{c}</div>
                                ))}

                                {matrix.map((row, r) => (
                                    <React.Fragment key={`row-group-${r}`}>
                                        {/* Row Header */}
                                        <div style={{
                                            height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.7rem', fontWeight: '800', color: activeCell.r === r ? "#818cf8" : theme.textDim,
                                            fontFamily: 'monospace'
                                        }}>R{r}</div>

                                        {row.map((val, c) => {
                                            const color = getCellColor(r, c);
                                            const active = (r === activeCell.r && c === activeCell.c);
                                            return (
                                                <div
                                                    key={`${r}-${c}`}
                                                    style={{
                                                        width: '60px', height: '60px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: color ? `${color}15` : (isDark ? "#1e293b" : "#fff"),
                                                        border: `2px solid ${color || (isDark ? "#334155" : "#e2e8f0")}`,
                                                        borderRadius: '12px',
                                                        fontWeight: '700', fontSize: '1.2rem',
                                                        color: color || theme.text,
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        transform: active ? 'scale(1.1) translateY(-5px)' : 'scale(1)',
                                                        boxShadow: active ? `0 10px 20px ${color}33` : 'none',
                                                        position: 'relative',
                                                        zIndex: active ? 10 : 1
                                                    }}
                                                >
                                                    {val}
                                                    {active && (
                                                        <div style={{
                                                            position: 'absolute', top: '-25px',
                                                            background: color, color: '#fff',
                                                            padding: '2px 8px', borderRadius: '4px',
                                                            fontSize: '0.55rem', fontWeight: '900',
                                                            textTransform: 'uppercase',
                                                            whiteSpace: 'nowrap',
                                                            boxShadow: `0 4px 10px ${color}44`
                                                        }}>
                                                            P({r},{c})
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        position: 'absolute', bottom: '2px', right: '4px',
                                                        fontSize: '0.45rem', opacity: 0.3, fontFamily: 'monospace'
                                                    }}>{r},{c}</div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </VizCard>

                        <div style={{
                            marginTop: '40px', color: theme.text, fontSize: '1rem',
                            lineHeight: '1.6', maxWidth: '600px', textAlign: 'center',
                            background: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(129, 140, 248, 0.05)',
                            padding: '20px 32px', borderRadius: '16px',
                            border: `1px solid ${isDark ? 'rgba(129, 140, 248, 0.2)' : 'rgba(129, 140, 248, 0.1)'}`,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}>
                            {step.msg}
                        </div>
                    </div>
                )
            }
            controls={
                !isPracticeMode && (
                    <ProgressBar
                        idx={idx}
                        total={steps.length}
                        accentColor="#818cf8"
                    />
                )
            }
        />
    );
}
