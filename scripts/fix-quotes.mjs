import fs from "fs";
const f = "src/app/page.tsx";
let s = fs.readFileSync(f, "utf8");
s = s.replace(/create "Review PR #247"/g, 'create "Review PR #247"');
s = s.replace(/any 'old' platform/g, "any 'old' platform");
fs.writeFileSync(f, s);
console.log("patched");