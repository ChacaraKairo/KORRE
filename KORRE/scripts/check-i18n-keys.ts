import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.resolve(__dirname, '../locales');
const baseLang = 'pt.json';

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flatten(value as Record<string, unknown>, fullKey);
    }

    return [fullKey];
  });
}

function readJson(file: string): Record<string, unknown> {
  const filePath = path.join(localesDir, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

const files = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith('.json'))
  .sort();

if (!files.includes(baseLang)) {
  console.error(`Base locale not found: ${baseLang}`);
  process.exit(1);
}

const baseKeys = new Set(flatten(readJson(baseLang)));
let hasError = false;

for (const file of files) {
  if (file === baseLang) continue;

  const currentKeys = new Set(flatten(readJson(file)));
  const missing = [...baseKeys].filter((key) => !currentKeys.has(key));
  const extra = [...currentKeys].filter((key) => !baseKeys.has(key));

  if (missing.length > 0 || extra.length > 0) {
    hasError = true;
    console.log(`\n[${file}]`);

    if (missing.length > 0) {
      console.log('Missing keys:');
      missing.forEach((key) => console.log(`  - ${key}`));
    }

    if (extra.length > 0) {
      console.log('Extra keys:');
      extra.forEach((key) => console.log(`  - ${key}`));
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log('i18n keys are synchronized.');
