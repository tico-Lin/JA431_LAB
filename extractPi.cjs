const fs = require('fs');

const file = fs.readFileSync('src/i18n.ts', 'utf8');

// A quick and dirty extraction (assuming it's a valid JS object if we wrap it)
// But wait, the file uses TypeScript and `import`. Let's just use regex to extract the `pi: { ... }` block.
// Or even easier, I can just copy the `pi:` object from zh-TW and en manually, but it's very large.
// Let's use ts-node to compile and extract? But it has imports that might fail.
// Better way: write a simple TS AST parser or regex.

// Let's try to extract zh-TW pi object:
const zhTWStart = file.indexOf("  'zh-TW': {");
const zhTWPiStart = file.indexOf("pi: {", zhTWStart);
// Find the closing brace of pi by counting braces
let openBraces = 0;
let zhTWPiEnd = -1;
for (let i = zhTWPiStart + 3; i < file.length; i++) {
    if (file[i] === '{') openBraces++;
    if (file[i] === '}') {
        openBraces--;
        if (openBraces === 0) {
            zhTWPiEnd = i + 1;
            break;
        }
    }
}

const zhTWPiCode = "module.exports = " + file.substring(zhTWPiStart + 3, zhTWPiEnd) + ";";
fs.writeFileSync('temp_zhTW.js', zhTWPiCode);

const enStart = file.indexOf("  en: {");
const enPiStart = file.indexOf("pi: {", enStart);
openBraces = 0;
let enPiEnd = -1;
for (let i = enPiStart + 3; i < file.length; i++) {
    if (file[i] === '{') openBraces++;
    if (file[i] === '}') {
        openBraces--;
        if (openBraces === 0) {
            enPiEnd = i + 1;
            break;
        }
    }
}
const enPiCode = "module.exports = " + file.substring(enPiStart + 3, enPiEnd) + ";";
fs.writeFileSync('temp_en.js', enPiCode);
