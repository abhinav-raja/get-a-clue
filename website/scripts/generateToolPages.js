import fs from 'fs';
import path from 'path';
import {tools} from '../src/tools.js';

const outDir = path.resolve('src', 'toolJsEntries');
const htmlDir = path.resolve('tools');
const templateDir = path.resolve('src', 'templates');

// Ensure folders exist
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });

// Read templates
const entryTemplate = fs.readFileSync(path.join(templateDir, 'toolPage.js'), 'utf-8');
const htmlTemplate = fs.readFileSync(path.join(templateDir, 'toolPage.html'), 'utf-8');

for (const tool of tools) {
  // Generate JS Entry File
  const entryContent = entryTemplate.replace(/__TOOL_NAME__/g, tool.name);
  fs.writeFileSync(path.join(outDir, `${tool.name}.js`), entryContent);

  // Generate HTML File
  const htmlContent = htmlTemplate
    .replace(/__TOOL_TITLE__/g, tool.label)
    .replace(/__TOOL_JS_PATH__/g, `/src/toolJsEntries/${tool.name}.js`);
  fs.writeFileSync(path.join(htmlDir, `${tool.name}.html`), htmlContent);
}

console.log('All tool pages generated!');
