import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const APP_DIR = join(ROOT, 'src', 'app');

const PROD_COMPONENT_FILES = [
  'src/components/game/LobbyClient.tsx',
  'src/components/game/AllGamesClient.tsx',
  'src/components/fadderuka/FadderukaClient.tsx',
  'src/components/game/RussetidenClient.tsx',
  'src/components/drikkeleker/DrikkelekerClient.tsx',
  'src/components/musikkleker/MusikklekerClient.tsx',
  'src/components/skjermleker/SkjermlekerClient.tsx',
];

const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i,
  /Plass for/i,
  /kommer snart/i,
  /under utvikling/i,
];

function walk(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...walk(entryPath));
      continue;
    }
    result.push(entryPath);
  }
  return result;
}

const routeFiles = walk(APP_DIR)
  .map((file) => relative(ROOT, file).replaceAll('\\\\', '/'))
  .filter((file) => file.endsWith('/page.tsx'))
  .filter((file) => !file.startsWith('src/app/lokal/'))
  .filter((file) => !file.startsWith('src/app/print/'));

const filesToScan = [...new Set([...routeFiles, ...PROD_COMPONENT_FILES])].filter((file) => {
  const abs = join(ROOT, file);
  return existsSync(abs) && statSync(abs).isFile();
});

const findings = [];

for (const file of filesToScan) {
  const content = readFileSync(join(ROOT, file), 'utf8');
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const hit = PLACEHOLDER_PATTERNS.find((pattern) => pattern.test(line));
    if (!hit) {
      continue;
    }

    findings.push({
      file,
      lineNumber: index + 1,
      line: line.trim(),
      pattern: hit.source,
    });
  }
}

if (findings.length > 0) {
  console.error('Fant placeholder-tekst i produksjonsruter. Fjern eller erstatt disse før PR:');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.lineNumber} (${finding.pattern})`);
    console.error(`  ${finding.line}`);
  }
  process.exit(1);
}

console.log(`Ingen placeholder-tekst funnet i ${filesToScan.length} produksjonsfiler.`);
