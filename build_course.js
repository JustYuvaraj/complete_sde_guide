// Build script: Generates lld_course.html with all course data inline
const fs = require('fs');
const path = require('path');
const dir = __dirname;

// Read data files as raw text
const data1 = fs.readFileSync(path.join(dir, 'lld_course_data.js'), 'utf-8');
const data2 = fs.readFileSync(path.join(dir, 'lld_course_data2.js'), 'utf-8');
const prob1 = fs.readFileSync(path.join(dir, 'lld_course_problems1.js'), 'utf-8');
const prob2 = fs.readFileSync(path.join(dir, 'lld_course_problems2.js'), 'utf-8');

// Extract array content from each file (between first [ and last ])
function extractArray(src) {
    const first = src.indexOf('[');
    const last = src.lastIndexOf(']');
    return src.substring(first + 1, last).trim();
}

// prob1 has: [{title:"LLD Practice Problems",topics:[...5 topics...]}]
// prob2 has: [...10 topic objects...]
const p1Content = extractArray(prob1).trim().replace(/,\s*$/, '');
const p2Topics = extractArray(prob2).trim().replace(/,\s*$/, '');

// Merge prob2 topics into prob1's topics array
const lastBracket = p1Content.lastIndexOf(']');
const mergedModule5 = p1Content.substring(0, lastBracket) + ',\n' + p2Topics + '\n' + p1Content.substring(lastBracket);

const d1Content = extractArray(data1).trim().replace(/,\s*$/, '');
const d2Content = extractArray(data2).trim().replace(/,\s*$/, '');

// Build the complete COURSE array content
const courseArrayContent = [d1Content, d2Content, mergedModule5].join(',\n');

// Generate the full HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LLD Mastery — From Zero to FAANG</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--bg2:#12121a;--bg3:#1a1a28;--bg4:#22223a;--accent:#6c5ce7;--accent2:#a29bfe;--accent3:#00cec9;--text:#e8e8f0;--text2:#9999b0;--text3:#666680;--green:#00b894;--red:#ff6b6b;--orange:#fdcb6e;--blue:#74b9ff;--border:#2a2a40;--card:#15152a;--glow:0 0 20px rgba(108,92,231,0.3)}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;overflow:hidden}
/* Sidebar */
.sidebar{width:320px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;height:100vh;flex-shrink:0;overflow:hidden}
.sidebar-header{padding:24px 20px;border-bottom:1px solid var(--border);text-align:center}
.sidebar-header h1{font-size:20px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--accent3));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.sidebar-header p{font-size:11px;color:var(--text2);margin-top:4px;letter-spacing:1px;text-transform:uppercase}
.progress-bar-container{padding:12px 20px;border-bottom:1px solid var(--border)}
.progress-bar{height:6px;background:var(--bg4);border-radius:3px;overflow:hidden}
.progress-bar-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent3));border-radius:3px;transition:width .5s ease;width:0%}
.progress-text{font-size:11px;color:var(--text2);margin-top:6px;text-align:center}
.nav-list{flex:1;overflow-y:auto;padding:12px 0}
.nav-list::-webkit-scrollbar{width:4px}
.nav-list::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:2px}
.nav-module{margin-bottom:4px}
.nav-module-header{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;font-size:13px;font-weight:600;color:var(--text2);transition:all .2s;user-select:none}
.nav-module-header:hover{color:var(--text);background:var(--bg3)}
.nav-module-header.active{color:var(--accent2)}
.nav-module-header .arrow{font-size:10px;transition:transform .2s}
.nav-module-header.expanded .arrow{transform:rotate(90deg)}
.nav-module-header .mod-num{background:var(--bg4);color:var(--accent2);border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace}
.nav-items{display:none;padding:2px 0}
.nav-items.show{display:block}
.nav-item{display:flex;align-items:center;gap:8px;padding:7px 20px 7px 48px;cursor:pointer;font-size:12px;color:var(--text3);transition:all .2s;border-left:2px solid transparent}
.nav-item:hover{color:var(--text);background:rgba(108,92,231,0.05)}
.nav-item.active{color:var(--accent2);border-left-color:var(--accent);background:rgba(108,92,231,0.08)}
.nav-item.completed{color:var(--green)}
.nav-item .check{width:14px;height:14px;border:1.5px solid var(--text3);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;cursor:pointer;transition:all .2s}
.nav-item.completed .check{background:var(--green);border-color:var(--green);color:#fff}
/* Main */
.main{flex:1;overflow-y:auto;height:100vh}
.main::-webkit-scrollbar{width:6px}
.main::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:3px}
.content-area{max-width:900px;margin:0 auto;padding:40px 48px 80px}
.module-badge{display:inline-block;background:linear-gradient(135deg,var(--accent),var(--accent3));color:#fff;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px}
.content-area h2{font-size:32px;font-weight:800;margin-bottom:8px;line-height:1.2}
.content-area h3{font-size:22px;font-weight:700;margin:36px 0 16px;color:var(--accent2);padding-bottom:8px;border-bottom:1px solid var(--border)}
.content-area h4{font-size:17px;font-weight:600;margin:24px 0 12px;color:var(--text)}
.content-area p{font-size:15px;line-height:1.8;color:var(--text2);margin-bottom:14px}
.content-area ul,.content-area ol{margin:8px 0 16px 24px;color:var(--text2);font-size:14px;line-height:2}
.content-area li{margin-bottom:4px}
.content-area strong{color:var(--text);font-weight:600}
.content-area em{color:var(--accent2);font-style:normal}
/* Code blocks */
pre{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:20px;margin:14px 0 20px;overflow-x:auto;position:relative}
pre code{font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.7;color:var(--text)}
code{font-family:'JetBrains Mono',monospace;background:var(--bg3);padding:2px 6px;border-radius:4px;font-size:13px;color:var(--accent2)}
/* Keyword highlighting */
.kw{color:#c792ea;font-weight:600} /* keywords */
.tp{color:#ffcb6b} /* types */
.fn{color:#82aaff} /* functions */
.st{color:#c3e88d} /* strings */
.cm{color:#546e7a;font-style:italic} /* comments */
.nu{color:#f78c6c} /* numbers */
.an{color:#f07178} /* annotations */
/* Callout boxes */
.callout{padding:16px 20px;border-radius:10px;margin:16px 0;font-size:14px;line-height:1.7}
.callout-title{font-weight:700;margin-bottom:6px;font-size:13px;text-transform:uppercase;letter-spacing:.5px}
.callout.tip{background:rgba(0,206,201,0.08);border-left:3px solid var(--accent3);color:var(--accent3)}
.callout.warn{background:rgba(253,203,110,0.08);border-left:3px solid var(--orange);color:var(--orange)}
.callout.important{background:rgba(108,92,231,0.08);border-left:3px solid var(--accent);color:var(--accent2)}
.callout.interview{background:rgba(0,184,148,0.08);border-left:3px solid var(--green);color:var(--green)}
.callout p{color:inherit;margin:0}
/* Comparison table */
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:var(--bg4);color:var(--accent2);padding:10px 14px;text-align:left;font-weight:600;border:1px solid var(--border)}
td{padding:10px 14px;border:1px solid var(--border);color:var(--text2)}
tr:hover td{background:rgba(108,92,231,0.04)}
/* Section divider */
.section-divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:40px 0}
/* Hidden sections */
.topic-section{display:none}
.topic-section.active{display:block}
/* Responsive */
@media(max-width:900px){.sidebar{width:260px}.content-area{padding:24px}}
@media(max-width:600px){.sidebar{position:fixed;left:-320px;z-index:100;transition:left .3s}.sidebar.open{left:0}.content-area{padding:16px}}
/* UML diagram style */
.uml-box{background:var(--bg3);border:2px solid var(--accent);border-radius:8px;padding:0;margin:16px 0;display:inline-block;min-width:280px;font-family:'JetBrains Mono',monospace;font-size:12px}
.uml-box .uml-title{background:var(--accent);color:#fff;padding:8px 16px;text-align:center;font-weight:700;font-size:13px}
.uml-box .uml-section{padding:8px 16px;border-top:1px solid var(--border)}
.uml-box .uml-section:first-of-type{border-top:none}
.uml-arrow{color:var(--accent2);font-family:'JetBrains Mono',monospace;text-align:center;padding:8px;font-size:14px}
/* Mobile menu toggle */
.mobile-toggle{display:none;position:fixed;top:12px;left:12px;z-index:200;background:var(--accent);color:#fff;border:none;border-radius:8px;width:40px;height:40px;font-size:20px;cursor:pointer}
@media(max-width:600px){.mobile-toggle{display:flex;align-items:center;justify-content:center}}
</style>
</head>
<body>
<button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>
<div class="sidebar">
  <div class="sidebar-header">
    <h1>⚡ LLD Mastery</h1>
    <p>From Zero to FAANG</p>
  </div>
  <div class="progress-bar-container">
    <div class="progress-bar"><div class="progress-bar-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText">0% Complete</div>
  </div>
  <div class="nav-list" id="navList"></div>
</div>
<div class="main">
  <div class="content-area" id="contentArea">
  </div>
</div>

<script>
// ===== COURSE DATA =====
const COURSE = [
${courseArrayContent}
];

// Navigation + Progress
let currentTopic = null;
const progress = JSON.parse(localStorage.getItem('lld_progress') || '{}');

function buildNav() {
  const nav = document.getElementById('navList');
  nav.innerHTML = '';
  COURSE.forEach((mod, mi) => {
    const modDiv = document.createElement('div');
    modDiv.className = 'nav-module';
    const header = document.createElement('div');
    header.className = 'nav-module-header';
    header.innerHTML = \`<span class="arrow">▶</span><span class="mod-num">M\${mi+1}</span>\${mod.title}\`;
    header.onclick = () => { header.classList.toggle('expanded'); items.classList.toggle('show'); };
    modDiv.appendChild(header);
    const items = document.createElement('div');
    items.className = 'nav-items';
    mod.topics.forEach((topic, ti) => {
      const key = \`\${mi}-\${ti}\`;
      const item = document.createElement('div');
      item.className = 'nav-item' + (progress[key] ? ' completed' : '') + (currentTopic === key ? ' active' : '');
      item.innerHTML = \`<div class="check" data-key="\${key}">\${progress[key] ? '✓' : ''}</div><span>\${topic.title}</span>\`;
      item.querySelector('.check').onclick = (e) => { e.stopPropagation(); toggleComplete(key); };
      item.onclick = () => loadTopic(mi, ti);
      items.appendChild(item);
    });
    modDiv.appendChild(items);
    nav.appendChild(modDiv);
  });
  updateProgress();
}

function toggleComplete(key) {
  progress[key] = !progress[key];
  localStorage.setItem('lld_progress', JSON.stringify(progress));
  buildNav();
}

function updateProgress() {
  let total = 0, done = 0;
  COURSE.forEach((m, mi) => m.topics.forEach((t, ti) => { total++; if (progress[\`\${mi}-\${ti}\`]) done++; }));
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = \`\${pct}% Complete (\${done}/\${total} topics)\`;
}

function loadTopic(mi, ti) {
  currentTopic = \`\${mi}-\${ti}\`;
  const mod = COURSE[mi];
  const topic = mod.topics[ti];
  const ca = document.getElementById('contentArea');
  ca.innerHTML = \`<div class="module-badge">Module \${mi+1}: \${mod.title}</div><h2>\${topic.title}</h2>\${topic.content}\`;
  document.querySelector('.main').scrollTop = 0;
  // Expand sidebar module
  const headers = document.querySelectorAll('.nav-module-header');
  const itemDivs = document.querySelectorAll('.nav-items');
  headers.forEach((h, i) => { if (i === mi) { h.classList.add('expanded'); itemDivs[i].classList.add('show'); } });
  buildNav();
  // Close mobile sidebar
  document.querySelector('.sidebar').classList.remove('open');
}

function showWelcome() {
  document.getElementById('contentArea').innerHTML = \`
    <div style="text-align:center;padding:60px 20px">
      <div style="font-size:64px;margin-bottom:20px">⚡</div>
      <h2 style="font-size:36px;margin-bottom:16px;background:linear-gradient(135deg,#6c5ce7,#00cec9);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">LLD Mastery Course</h2>
      <p style="font-size:18px;color:#9999b0;max-width:600px;margin:0 auto 32px">From absolute zero to cracking the Low-Level Design round at FAANG & top tech companies.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;max-width:700px;margin:0 auto 40px">
        <div style="background:#15152a;border:1px solid #2a2a40;border-radius:12px;padding:20px;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">☕</div>
          <div style="font-weight:700;margin-bottom:4px">Module 1</div>
          <div style="font-size:12px;color:#9999b0">Java from Zero</div>
        </div>
        <div style="background:#15152a;border:1px solid #2a2a40;border-radius:12px;padding:20px;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">🏗️</div>
          <div style="font-weight:700;margin-bottom:4px">Module 2</div>
          <div style="font-size:12px;color:#9999b0">OOP & SOLID</div>
        </div>
        <div style="background:#15152a;border:1px solid #2a2a40;border-radius:12px;padding:20px;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">🎨</div>
          <div style="font-weight:700;margin-bottom:4px">Module 3</div>
          <div style="font-size:12px;color:#9999b0">Design Patterns</div>
        </div>
        <div style="background:#15152a;border:1px solid #2a2a40;border-radius:12px;padding:20px;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">📐</div>
          <div style="font-weight:700;margin-bottom:4px">Module 4</div>
          <div style="font-size:12px;color:#9999b0">UML & Interview Framework</div>
        </div>
        <div style="background:#15152a;border:1px solid #2a2a40;border-radius:12px;padding:20px;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">🔥</div>
          <div style="font-weight:700;margin-bottom:4px">Module 5</div>
          <div style="font-size:12px;color:#9999b0">15 FAANG LLD Problems</div>
        </div>
      </div>
      <p style="font-size:14px;color:#666680">👈 Click any topic in the sidebar to begin your journey</p>
    </div>\`;
}

// Init
showWelcome();
buildNav();
<\/script>
</body>
</html>`;

// Write final HTML
fs.writeFileSync(path.join(dir, 'lld_course.html'), html, 'utf-8');

console.log('✅ Build complete!');
console.log('   Final file size: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
