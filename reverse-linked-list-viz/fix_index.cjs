const fs = require('fs');

const filepath = 'C:/Users/justy/complete/reverse-linked-list-viz/src/engines/index.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const lines = content.split(/\r?\n/);
const imports = lines.filter(line => line.startsWith('import {') && line.includes('Config'));

let exportsCode = '\n// Each export is a simple component the registry can reference\n';

for (const line of imports) {
    const match = line.match(/import\s*\{\s*([a-zA-Z0-9_]+Config)\s*\}\s*from/);
    if (match) {
        let configName = match[1];
        let baseName = configName.replace('Config', '');
        let capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        exportsCode += `export function Eng${capitalized}(props) { return <ArrayVizEngine config={${configName}} {...props} />; }\n`;
    }
}

const cleanLines = lines.filter(line => line.trim() === '' || (!line.startsWith('export function Eng') && !line.includes('Each export is a simple component the registry can reference')));

let newContent = cleanLines.join('\n').trim() + '\n\n' + exportsCode;
fs.writeFileSync(filepath, newContent);
console.log('Done building index.jsx');
