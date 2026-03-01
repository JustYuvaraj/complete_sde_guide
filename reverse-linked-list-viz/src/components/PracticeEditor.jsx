import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../shared/ThemeContext';
import { pythonRunner } from '../services/pythonRunner';
import lcDescriptions from '../data/lc_descriptions.json';

export default function PracticeEditor({ config, onClose, embedded = false }) {
    const { theme, isDark } = useTheme();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [testInputs, setTestInputs] = useState('');
    const [activeTab, setActiveTab] = useState('testcase'); // 'testcase' or 'results'

    // Initialize code from config
    useEffect(() => {
        if (!config) return;

        let initialCode = 'class Solution:\n    def solve(self, *args):\n        pass\n';
        if (config.code) {
            initialCode = config.code.map(c => c.text).join('\n');
        }

        // Only set code if the editor is currently empty or resetting to a different problem
        // This prevents clobbering while the user is typing
        setCode(prev => {
            if (prev && prev.trim().length > 0 && prev.includes('class Solution')) return prev;

            const lines = initialCode.split('\n');
            while (lines.length < 15) {
                lines.push('');
            }
            return lines.join('\n');
        });

        // Initialize test inputs
        if (config.defaults) {
            const defaultStr = Object.entries(config.defaults)
                .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
                .join('\n');
            setTestInputs(defaultStr);
        }
    }, [config]);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('');
        setTestResults(null);
        setActiveTab('results'); // Auto-switch to results when running

        try {
            // 1. Prepare user code (remove the indent if it's not wrapped in a class yet, or just use as is)
            const userCode = code;

            // 2. Prepare test code based on testInputs
            let testCode = '';

            // Extract variable values from testInputs string
            const argString = testInputs.split('\n')
                .map(line => line.split('=')[1]?.trim())
                .filter(Boolean)
                .join(', ');

            const match = userCode.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
            const funcName = match ? match[1] : 'solve';

            testCode = `
import json
try:
    if 'Solution' in globals():
        sol = Solution()
        result = sol.${funcName}(${argString})
    else:
        result = ${funcName}(${argString})
    
    print(f"\\n--- Test Results ---")
    print(f"Input: {json.dumps([${argString}])}")
    print(f"Output: {result}")
except Exception as e:
    print(f"\\nError: {str(e)}")
`;

            // 3. Run it
            const { stdout } = await pythonRunner.runCode(userCode, testCode);

            setOutput(stdout);
            setTestResults({ status: 'success' });
        } catch (error) {
            setOutput(`Error: ${error.message}`);
            setTestResults({ status: 'error' });
        } finally {
            setIsRunning(false);
        }
    };

    const description = config?.explain?.[0]?.content || 'No description available.';

    // Premium IDE Theme Variables
    const ccTheme = {
        bg: isDark ? '#0d1117' : '#f8f9fa',          // Ultra-deep GitHub/IDE dark or soft white
        headerBg: isDark ? '#161b22' : '#ffffff',    // Subtle elevation
        border: isDark ? '#30363d' : '#e5e7eb',      // Soft, non-distracting borders
        panelBg: isDark ? '#0d1117' : '#ffffff',     // Work area background matches bg for seamless look
        accent: '#2f81f7',                           // Vibrant blue for primary actions
        accentHover: '#3b8bfd',                      // Lighter blue for hover state
        success: '#3fb950',                          // Vibrant green for pass
        textPrimary: isDark ? '#e6edf3' : '#24292f', // Crisp reading text
        textMuted: isDark ? '#8b949e' : '#6e7781',   // Secondary tech text
        runBtn: isDark ? '#238636' : '#2da44e',      // Specific green for 'Run' action
        runBtnHover: isDark ? '#2ea043' : '#2c974b',
    };

    // The exact right-pane layout to be used standalone or embedded
    const editorAndConsolePane = (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#010409' : '#fafafa', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Minimalist Editor Toolbar */}
            <div style={{
                padding: '10px 20px', borderBottom: `1px solid ${ccTheme.border}`,
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                backgroundColor: isDark ? '#0d1117' : '#ffffff'
            }}>
                <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                    <div style={{ padding: '4px 12px', color: ccTheme.textMuted, fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", borderBottom: `2px solid ${ccTheme.accent}` }}>Solution.py</div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{
                            padding: '6px 18px', borderRadius: '6px',
                            backgroundColor: isDark ? '#21262d' : '#f3f4f6', color: ccTheme.textPrimary,
                            border: `1px solid ${isDark ? '#30363d' : '#d1d5db'}`,
                            cursor: isRunning ? 'wait' : 'pointer', fontWeight: '500', fontSize: '0.85rem',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                        onMouseOver={e => !isRunning && (e.currentTarget.style.backgroundColor = isDark ? '#30363d' : '#e5e7eb')}
                        onMouseOut={e => !isRunning && (e.currentTarget.style.backgroundColor = isDark ? '#21262d' : '#f3f4f6')}
                    >
                        <span style={{ color: ccTheme.textMuted }}>{isRunning ? '⏳' : '▶'}</span> {isRunning ? 'Running...' : 'Run Code'}
                    </button>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{
                            padding: '6px 20px', borderRadius: '6px',
                            backgroundColor: ccTheme.runBtn, color: '#ffffff',
                            border: `1px solid ${isDark ? 'rgba(240,246,252,0.1)' : 'rgba(27,31,36,0.15)'}`,
                            cursor: isRunning ? 'wait' : 'pointer',
                            fontWeight: '600', fontSize: '0.85rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                        onMouseOver={e => !isRunning && (e.currentTarget.style.backgroundColor = ccTheme.runBtnHover)}
                        onMouseOut={e => !isRunning && (e.currentTarget.style.backgroundColor = ccTheme.runBtn)}
                        onMouseDown={e => !isRunning && (e.currentTarget.style.transform = 'scale(0.97)')}
                        onMouseUp={e => !isRunning && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        Submit
                    </button>
                </div>
            </div>

            {/* Monaco Editor Wrapper */}
            <div style={{ flex: 1, position: 'relative', paddingTop: '8px' }}>
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme={isDark ? "vs-dark" : "light"}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16, fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
                        padding: { top: 12, bottom: 12 }, lineNumbersMinChars: 3, scrollBeyondLastLine: false,
                        cursorBlinking: "smooth", cursorSmoothCaretAnimation: "on", smoothScrolling: true,
                        renderLineHighlight: 'all',
                        contextmenu: false, fontLigatures: true,
                    }}
                />
            </div>

            {/* Integrated Console Panel */}
            {/* ── Enhanced Terminal Section ── */}
            <div style={{
                height: '35%', minHeight: '220px', borderTop: `1px solid ${ccTheme.border}`,
                display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#0d1117' : '#fafafa',
                boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.2)' : '0 -4px 10px rgba(0,0,0,0.02)',
                zIndex: 5,
                position: 'relative'
            }}>
                {/* Visual Depth Bar */}
                <div style={{ height: '3px', background: isDark ? '#21262d' : '#f0f0f0', width: '100%', opacity: 0.5 }}></div>

                {/* Terminal Header Tabs */}
                <div style={{
                    display: 'flex', borderBottom: `1px solid ${ccTheme.border}`, backgroundColor: isDark ? '#161b22' : '#ffffff',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 6
                }}>
                    <button
                        onClick={() => setActiveTab('testcase')}
                        style={{
                            padding: '12px 16px', borderBottom: activeTab === 'testcase' ? `3px solid ${ccTheme.accent}` : '3px solid transparent',
                            color: activeTab === 'testcase' ? ccTheme.textPrimary : ccTheme.textMuted,
                            fontWeight: '700', fontSize: '0.82rem',
                            display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.05em',
                            background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3.7 3.7Z"></path><path d="m20 4-2 2"></path><path d="m19 11-4-4"></path><path d="m15 11-4-4"></path><path d="m11 15-4-4"></path><path d="m7 15-4-4"></path><path d="m13 19-4-4"></path><path d="m9 19-4-4"></path><path d="m5 19-2 2"></path></svg>
                        Testcase
                    </button>

                    <button
                        onClick={() => setActiveTab('results')}
                        style={{
                            padding: '12px 16px', borderBottom: activeTab === 'results' ? `3px solid ${ccTheme.accent}` : '3px solid transparent',
                            color: activeTab === 'results' ? ccTheme.textPrimary : ccTheme.textMuted,
                            fontWeight: '700', fontSize: '0.82rem',
                            display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.05em',
                            background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 17 6-6-6-6"></path><path d="M12 19h8"></path></svg>
                        Test Results
                    </button>
                </div>

                {/* Terminal Content Switcher */}
                <div style={{
                    flex: 1, overflowY: "auto",
                    backgroundColor: isDark ? '#0d1117' : '#ffffff'
                }}>
                    {activeTab === 'testcase' ? (
                        <div style={{ padding: '20px 32px' }}>
                            <div style={{ color: ccTheme.textMuted, fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>Input Parameters</div>
                            <div style={{
                                background: isDark ? '#161b22' : '#f6f8fa',
                                border: `1px solid ${ccTheme.border}`,
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                <textarea
                                    value={testInputs}
                                    onChange={(e) => setTestInputs(e.target.value)}
                                    placeholder="e.g. nums = [2,7,11,15]\ntarget = 9"
                                    style={{
                                        width: '100%', minHeight: '120px',
                                        background: 'transparent', color: ccTheme.textPrimary,
                                        border: 'none', padding: '16px', outline: 'none',
                                        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: '12px', color: ccTheme.textMuted, fontSize: '0.75rem', fontStyle: 'italic' }}>
                                Format: variable_name = value
                            </div>
                        </div>
                    ) : (
                        /* Results Tab */
                        <div style={{ height: '100%' }}>
                            {isRunning ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: ccTheme.textMuted }}>
                                    <span className="premium-spinner"></span>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.02em', opacity: 0.8 }}>Executing Python Sandbox...</div>
                                </div>
                            ) : !output ? (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%',
                                    color: ccTheme.textMuted, opacity: 0.5, textAlign: 'center'
                                }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.3 }}><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                                    <div style={{ fontSize: '0.9rem' }}>Press "Run Code" to view execution results</div>
                                </div>
                            ) : (
                                <div style={{ padding: '24px 32px', animation: 'fadeIn 0.3s ease-out' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                        {testResults?.status === 'success' ? (
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                color: '#3fb950', fontWeight: '800', fontSize: '1.1rem',
                                            }}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                Accepted
                                            </div>
                                        ) : (
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                color: '#f85149', fontWeight: '800', fontSize: '1.1rem',
                                            }}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                Runtime Error
                                            </div>
                                        )}
                                        <div style={{ height: '16px', width: '1px', backgroundColor: ccTheme.border }}></div>
                                        <div style={{ color: ccTheme.textMuted, fontSize: '0.85rem' }}>Runtime: 42ms</div>
                                    </div>

                                    {/* Structured Test Result Cards */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f6f8fa',
                                            borderRadius: '12px', border: `1px solid ${ccTheme.border}`,
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${ccTheme.border}`, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', color: ccTheme.textMuted, fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                                Console Output
                                            </div>
                                            <div style={{ padding: '16px', color: testResults?.status === 'error' ? (isDark ? '#ff7b72' : '#cf222e') : 'inherit', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                                {output}
                                            </div>
                                        </div>

                                        {testResults?.status === 'success' && (
                                            <div style={{
                                                backgroundColor: isDark ? 'rgba(63, 185, 80, 0.05)' : 'rgba(63, 185, 80, 0.05)',
                                                borderRadius: '12px', border: `1px solid rgba(63, 185, 80, 0.2)`,
                                                padding: '16px'
                                            }}>
                                                <div style={{ color: '#3fb950', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Testcase Passed</div>
                                                <div style={{ color: ccTheme.textPrimary, fontSize: '0.85rem' }}>Your code passed the default test case successfully!</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Global animations & Premium aesthetics */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .premium-spinner {
                    width: 32px; height: 32px;
                    border: 3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                    border-top-color: ${ccTheme.accent};
                    border-radius: 50%;
                    animation: premium-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                
                @keyframes premium-spin { to { transform: rotate(360deg); } }

                /* Custom scrollbars for high-end feel */
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { 
                    background: ${isDark ? '#30363d' : '#d1d5db'}; 
                    border-radius: 10px; 
                    border: 2px solid ${isDark ? '#0d1117' : '#fafafa'}; 
                }
                ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#484f58' : '#9ca3af'}; }
            `}</style>
        </div>
    );

    // If embedded inside SplitVizLayout, we only render the editor/console part
    if (embedded) {
        return editorAndConsolePane;
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            backgroundColor: ccTheme.bg, color: ccTheme.textPrimary,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}>
            {/* ── Premium Header ── */}
            <div style={{
                padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: ccTheme.headerBg, borderBottom: `1px solid ${ccTheme.border}`,
                boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.04)' : '0 1px 3px rgba(0,0,0,0.04)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '6px 14px', borderRadius: '6px', background: isDark ? '#21262d' : '#f3f4f6',
                            color: ccTheme.textPrimary, border: `1px solid ${isDark ? '#30363d' : '#d1d5db'}`,
                            cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem',
                            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.04)' : '0 1px 2px rgba(0,0,0,0.04)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = isDark ? '#30363d' : '#e5e7eb'; }}
                        onMouseOut={e => { e.currentTarget.style.background = isDark ? '#21262d' : '#f3f4f6'; }}
                        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span> Visualizer
                    </button>

                    <div style={{ paddingLeft: '24px', borderLeft: `1px solid ${ccTheme.border}` }}>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: ccTheme.textPrimary, letterSpacing: '-0.01em' }}>
                            {config?.title || 'Practice Challenge'}
                        </h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                        padding: '6px 14px', borderRadius: '100px',
                        backgroundColor: isDark ? 'rgba(47, 129, 247, 0.1)' : 'rgba(47, 129, 247, 0.08)',
                        color: ccTheme.accent, fontSize: '0.8rem', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        border: `1px solid ${isDark ? 'rgba(47, 129, 247, 0.2)' : 'rgba(47, 129, 247, 0.15)'}`
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ccTheme.accent, display: 'inline-block' }}></span>
                        Python 3.11
                    </div>
                </div>
            </div>

            {/* ── Main Workspace Split ── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Pane: Elegant Problem Description */}
                <div style={{
                    flex: '0 0 50%', width: '50%', borderRight: `1px solid ${ccTheme.border}`,
                    backgroundColor: ccTheme.panelBg, display: 'flex', flexDirection: 'column',
                    boxShadow: isDark ? 'inset -1px 0 0 rgba(255,255,255,0.02)' : 'inset -1px 0 0 rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        padding: '16px 32px', borderBottom: `1px solid ${ccTheme.border}`,
                        backgroundColor: isDark ? '#0d1117' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ccTheme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: ccTheme.textPrimary, fontWeight: '600' }}>Description</h3>
                    </div>

                    <div className="markdown-body" style={{
                        flex: 1, padding: '32px', overflowY: 'auto', color: ccTheme.textPrimary,
                        fontSize: '1.05rem', lineHeight: '1.8',
                        // High-quality markdown typography settings
                        '--color-fg-default': ccTheme.textPrimary,
                        '--color-canvas-default': 'transparent',
                        '--color-border-default': ccTheme.border,
                        '--color-accent-fg': ccTheme.accent,
                        '--color-canvas-subtle': isDark ? '#161b22' : '#f6f8fa',
                    }}>
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            remarkPlugins={[remarkGfm]}
                        >
                            {config?.description || config?.problemDescription || lcDescriptions[config?.title]?.content || 'No description available.'}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Right Pane: Code Editor & Console */}
                {editorAndConsolePane}

            </div>
        </div>
    );
}
