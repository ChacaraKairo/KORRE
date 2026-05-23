import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(__dirname, '..');
const extensions = new Set(['.ts', '.tsx']);
const ignoredParts = new Set([
  'node_modules',
  '.expo',
  '.git',
  'locales',
  'tests',
  'styles',
  'scripts',
]);

const patterns: Array<{ label: string; regex: RegExp }> = [
  { label: '<Text>literal', regex: /<Text[^>]*>\s*["'`]?([A-Za-zÀ-ÿ][^<{}`]*)/g },
  { label: 'Alert.alert literal', regex: /Alert\.alert\(\s*['"`]([^'"`]+)['"`]/g },
  { label: 'showCustomAlert literal', regex: /showCustomAlert\(\s*['"`]([^'"`]+)['"`]/g },
  { label: 'setErro literal', regex: /setErro\(\s*['"`]([^'"`]+)['"`]/g },
  { label: 'placeholder literal', regex: /placeholder\s*=\s*['"`]([^'"`]+)['"`]/g },
  { label: 'title literal prop', regex: /\btitle\s*=\s*['"`]([^'"`]+)['"`]/g },
  { label: 'subtitle literal prop', regex: /\bsubtitle\s*=\s*['"`]([^'"`]+)['"`]/g },
  { label: 'buttonText literal prop', regex: /\bbuttonText\s*=\s*['"`]([^'"`]+)['"`]/g },
];

const ignoredExactText = new Set([
  'KORRE',
  'R$',
  'X',
  'KM',
  'km',
  '--:--',
  '0.00',
  '0,00',
  'R$ 0,00',
  '000.000.000-00',
  'ABC1D23',
  'DD/MM/AAAA',
  '2026',
]);

const ignoredTextPatterns = [
  /^Ex:/i,
  /^Ej:/i,
  /^v?\d+(\.\d+){1,3}$/i,
  /^[-+]?R?\$?\s*\d+([.,]\d+)?%?$/i,
  /^[A-Z]{2,5}\d[A-Z]\d{2}$/i,
  /^[â€¢•]+$/,
];

function isProbablyNotTranslatable(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return (
    ignoredExactText.has(normalized) ||
    ignoredTextPatterns.some((pattern) => pattern.test(normalized))
  );
}

function shouldIgnore(filePath: string) {
  const relative = path.relative(rootDir, filePath);
  return relative
    .split(path.sep)
    .some((part) => ignoredParts.has(part));
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoredParts.has(entry.name)) return [];
      return walk(fullPath);
    }

    if (!extensions.has(path.extname(entry.name)) || shouldIgnore(fullPath)) {
      return [];
    }

    return [fullPath];
  });
}

function lineNumber(content: string, index: number) {
  return content.slice(0, index).split(/\r?\n/).length;
}

let total = 0;

for (const file of walk(rootDir)) {
  const content = fs.readFileSync(file, 'utf8');
  const findings: string[] = [];

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.regex.exec(content))) {
      const text = match[1]?.trim();

      if (
        !text ||
        text.startsWith('http') ||
        text.includes('://') ||
        isProbablyNotTranslatable(text)
      ) {
        continue;
      }

      findings.push(
        `  ${lineNumber(content, match.index)}: ${pattern.label}: ${JSON.stringify(text)}`,
      );
      total += 1;
    }
  }

  if (findings.length > 0) {
    console.log(`\n${path.relative(rootDir, file)}`);
    findings.forEach((finding) => console.log(finding));
  }
}

if (total === 0) {
  console.log('No hardcoded user-facing text candidates found.');
} else {
  console.log(`\nFound ${total} hardcoded user-facing text candidate(s).`);
  console.log('Review manually: this scanner is intentionally conservative and may report false positives.');
}
