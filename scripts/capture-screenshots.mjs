import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs', 'screenshots');
const indexPath = path.join(root, 'src', 'index.js');
const indexBackup = path.join(root, 'src', 'index.js.screenshot-bak');

const appRoutes = [
  { path: '/', name: '01-home' },
  { path: '/ingestion', name: '02-ingestion' },
  { path: '/transformation', name: '03-transformation' },
  { path: '/standardization', name: '04-standardization' },
  { path: '/workflows', name: '05-workflows' },
  { path: '/dashboards', name: '06-dashboards' },
  { path: '/playbooks', name: '07-playbooks' },
  { path: '/sources', name: '08-sources' },
  { path: '/destinations', name: '09-destinations' },
  { path: '/profiles', name: '10-profiles' },
  { path: '/audiences', name: '11-audiences' },
  { path: '/identities', name: '12-identities' },
  { path: '/accounts/profiles', name: '13-account-profiles' },
  { path: '/accounts/audiences', name: '14-account-audiences' },
  { path: '/prospects', name: '15-prospects' },
  { path: '/schemas', name: '16-schemas' },
  { path: '/places', name: '17-places' },
  { path: '/datasets', name: '18-datasets' },
  { path: '/queries', name: '19-queries' },
  { path: '/monitoring', name: '20-monitoring' },
  { path: '/offers', name: '21-offers' },
  { path: '/components', name: '22-components' },
  { path: '/alerts', name: '23-alerts' },
  { path: '/sandboxes', name: '24-sandboxes' },
  { path: '/license', name: '25-license' },
  { path: '/encryption', name: '26-encryption' },
  { path: '/tealium', name: '27-tealium-supply-chain' },
  { path: '/tealium/usage', name: '28-tealium-usage' },
  { path: '/tealium/sources', name: '29-tealium-sources' },
  { path: '/tealium/eventstream', name: '30-tealium-eventstream' },
  { path: '/tealium/audiencestream', name: '31-tealium-audiencestream' },
  { path: '/tealium/dataaccess', name: '32-tealium-dataaccess' },
  { path: '/tealium/trace', name: '33-tealium-trace' },
];

const abcIndex = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Abc from './Abc';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Abc />
  </React.StrictMode>
);

reportWebVitals();
`;

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const capture = async (url, name) => {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: true,
  });
  console.log('saved', name);
};

for (const route of appRoutes) {
  await capture(`http://localhost:3000${route.path}`, route.name);
}

const originalIndex = fs.readFileSync(indexPath, 'utf8');
fs.writeFileSync(indexBackup, originalIndex);
fs.writeFileSync(indexPath, abcIndex);

try {
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: path.join(outDir, '00-abc-dashboard.png'),
    fullPage: true,
  });
  console.log('saved 00-abc-dashboard');
} finally {
  fs.writeFileSync(indexPath, originalIndex);
  fs.unlinkSync(indexBackup);
}

await browser.close();

const files = fs.readdirSync(outDir).filter((f) => f.endsWith('.png')).sort();
const readme = files.map((f) => `![](docs/screenshots/${f})`).join('\n\n') + '\n';
fs.writeFileSync(path.join(root, 'README.md'), readme);
console.log(`README updated with ${files.length} screenshots`);
