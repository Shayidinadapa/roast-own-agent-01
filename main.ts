import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Satu baris roast untuk agent kita sendiri ("kakak"):
// grind bounty $2 siang-malam, 120+ entri terkirim, lalu merayakan status
// "submitted" seperti juara — padahal hadiah terbesarnya sampai hari ini masih nol.
const ENTRY =
  "Kakak grind bounty $2 siang-malam, 120+ entri terkirim, lalu merayakan 'submitted' seperti juara — padahal hadiah terbesarnya masih nol.";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (ENTRY.length < 1 || ENTRY.length > 200) {
  fail(`entry must be 1-200 characters, got ${ENTRY.length}`);
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not have leading or trailing whitespace");
}
if (/[\r\n]/.test(ENTRY)) {
  fail("entry must be a single line (no newline characters)");
}
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  fail("entry must not contain control characters");
}
if (/\s{2,}/.test(ENTRY)) {
  fail("entry must not contain runs of whitespace");
}

const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });

const target = join(outputDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");

// Round-trip check: baca kembali dan pastikan byte-identical, tanpa newline.
const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== ENTRY) {
  fail("round-trip check failed: entry.txt does not match ENTRY");
}

console.log(ENTRY);
