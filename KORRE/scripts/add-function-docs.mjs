import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIRS = [
  "app",
  "components",
  "hooks",
  "modules",
  "notifications",
  "services",
  "utils",
  "database",
];

const TS_EXT = new Set([".ts", ".tsx"]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
      continue;
    }
    if (entry.isFile() && TS_EXT.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function humanize(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase();
}

function hasDocAbove(lines, index) {
  for (let i = index - 1; i >= 0; i--) {
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith("/**") || t.startsWith("*") || t.startsWith("//")) return true;
    return false;
  }
  return false;
}

function buildDoc(indent, fnName) {
  const text = humanize(fnName);
  return [
    `${indent}/**`,
    `${indent} * Executa a função de ${text}.`,
    `${indent} */`,
  ];
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const lines = original.split(/\r?\n/);
  const output = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const functionDecl = line.match(
      /^(\s*)(export\s+default\s+|export\s+|)?(async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/
    );
    const constArrow = line.match(
      /^(\s*)(export\s+default\s+|export\s+|)?const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(async\s*)?(\([^=]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>/
    );
    const typedConstArrow = line.match(
      /^(\s*)(export\s+default\s+|export\s+|)?const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*[^=]+\=\s*(async\s*)?(\([^=]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>/
    );

    if (functionDecl) {
      const indent = functionDecl[1];
      const fnName = functionDecl[4];
      if (!hasDocAbove(lines, i)) {
        output.push(...buildDoc(indent, fnName));
        changed = true;
      }
      output.push(line);
      continue;
    }

    if (constArrow) {
      const indent = constArrow[1];
      const fnName = constArrow[3];
      if (!hasDocAbove(lines, i)) {
        output.push(...buildDoc(indent, fnName));
        changed = true;
      }
      output.push(line);
      continue;
    }

    if (typedConstArrow) {
      const indent = typedConstArrow[1];
      const fnName = typedConstArrow[3];
      if (!hasDocAbove(lines, i)) {
        output.push(...buildDoc(indent, fnName));
        changed = true;
      }
      output.push(line);
      continue;
    }

    output.push(line);
  }

  if (changed) {
    fs.writeFileSync(filePath, output.join("\n"), "utf8");
  }
  return changed;
}

let changedFiles = 0;
let totalFiles = 0;

for (const relDir of TARGET_DIRS) {
  const dir = path.join(ROOT, relDir);
  if (!fs.existsSync(dir)) continue;
  for (const filePath of walk(dir)) {
    totalFiles++;
    if (processFile(filePath)) changedFiles++;
  }
}

console.log(`Processed: ${totalFiles} files`);
console.log(`Changed: ${changedFiles} files`);
