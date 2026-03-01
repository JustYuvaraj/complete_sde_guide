import React, { useState, useEffect } from "react";
import { SplitVizLayout } from "../shared/SplitVizLayout";
import { ExplainPanel, ControlPanel } from "../shared/Components";
import { useTheme } from "../shared/ThemeContext";
import PracticeEditor from "../components/PracticeEditor";

export default function StackVizEngine({ config, isPracticeMode, setIsPracticeMode, headerRightItem }) {
    const { isDark, theme } = useTheme();
    const [stepIndex, setStepIndex] = useState(0);

    const step = config.steps[stepIndex];
    if (!step) return null;

    const renderArray = (arr, label, highlightIdx = -1, color = "#22d3ee") => (
        <div style={{ marginBottom: '30px', width: '100%', maxWidth: '600px' }}>
            <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginBottom: '8px', fontWeight: '800', textTransform: 'uppercase' }}>
                {label}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {arr.map((val, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: '45px', height: '45px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: idx === highlightIdx ? `${color}33` : (isDark ? "#1e293b" : "#fff"),
                            border: `2px solid ${idx === highlightIdx ? color : (isDark ? "#334155" : "#e2e8f0")}`,
                            borderRadius: '8px',
                            fontWeight: '700', fontSize: '1.05rem',
                            color: idx === highlightIdx ? color : theme.text,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative'
                        }}
                    >
                        {val}
                        {idx === highlightIdx && (
                            <div style={{
                                position: 'absolute', top: '-25px', color: color,
                                fontSize: '0.9rem', fontWeight: '900'
                            }}>
                                ↓
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStack = (stack, label) => (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minWidth: '120px', height: '100%', justifyContent: 'flex-end'
        }}>
            <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginBottom: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                {label}
            </div>
            <div style={{
                width: '80px', minHeight: '200px',
                border: `3px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                display: 'flex', flexDirection: 'column-reverse',
                padding: '8px', gap: '8px',
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)'
            }}>
                {stack.length === 0 && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textDim, fontSize: '0.7rem', fontStyle: 'italic' }}>
                        Empty
                    </div>
                )}
                {stack.map((item, idx) => {
                    const val = typeof item === 'object' ? item.val : item;
                    return (
                        <div
                            key={idx}
                            style={{
                                height: '40px', background: isDark ? '#1e293b' : '#fff',
                                border: `2px solid #818cf8`,
                                borderRadius: '6px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '700', fontSize: '0.95rem',
                                color: '#818cf8',
                                animation: idx === stack.length - 1 ? 'pushIn 0.3s ease-out' : 'none'
                            }}
                        >
                            {val}
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes pushIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );

    return (
        <SplitVizLayout
            title={config.title}
            subtitle={config.subtitle}
            fullRight={isPracticeMode}
            headerRightItem={headerRightItem}
            leftPanel={
                <>
                    <ExplainPanel sections={config.explain} currentStep={stepIndex} />
                    <div style={{
                        marginTop: '32px', padding: '24px',
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '16px', border: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`
                    }}>
                        <div style={{ fontSize: '0.85rem', color: theme.textMuted, marginBottom: '16px', lineHeight: '1.6' }}>
                            {step.explain}
                        </div>
                    </div>
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
                        display: 'flex', flexDirection: 'column', padding: '40px'
                    }}>
                        <div style={{ display: 'flex', gap: '60px', flex: 1, alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                {renderArray(config.input, "Temperatures", step.i, "#818cf8")}
                                {step.results && renderArray(step.results, "Results (Days Wait)", -1, "#10b981")}
                            </div>
                            {renderStack(step.stack, "Monotonic Stack")}
                        </div>

                        <ControlPanel
                            currentStep={stepIndex}
                            totalSteps={config.steps.length}
                            onStepChange={setStepIndex}
                        />
                    </div>
                )
            }
        />
    );
}
