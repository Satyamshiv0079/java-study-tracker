import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src', 'components');

const replacements = [
  { regex: /bg-slate-900/g, replacement: 'bg-white dark:bg-slate-900' },
  { regex: /bg-slate-950/g, replacement: 'bg-slate-50 dark:bg-slate-950' },
  { regex: /bg-slate-800/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { regex: /text-slate-400/g, replacement: 'text-slate-600 dark:text-slate-400' },
  { regex: /text-slate-500/g, replacement: 'text-slate-500 dark:text-slate-500' }, 
  { regex: /text-slate-300/g, replacement: 'text-slate-700 dark:text-slate-300' },
  { regex: /text-slate-200/g, replacement: 'text-slate-800 dark:text-slate-200' },
  { regex: /text-slate-100/g, replacement: 'text-slate-900 dark:text-slate-100' },
  { regex: /text-white/g, replacement: 'text-slate-900 dark:text-white' },
  { regex: /border-slate-800/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /border-slate-700/g, replacement: 'border-slate-300 dark:border-slate-700' },
  { regex: /border-slate-600/g, replacement: 'border-slate-400 dark:border-slate-600' }
];

const componentsToProcess = [
  'DashboardTab.jsx',
  'SyllabusTab.jsx',
  'CodingTab.jsx',
  'InterviewTab.jsx',
  'ProjectTab.jsx',
  'AnalyticsTab.jsx',
  'MentorTab.jsx'
];

componentsToProcess.forEach(file => {
  const filePath = path.join(directoryPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ regex, replacement }) => {
      const safeRegex = new RegExp(`(?<!dark:|-)(?<![a-zA-Z0-9-])${regex.source}(?![a-zA-Z0-9-])`, 'g');
      content = content.replace(safeRegex, replacement);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
