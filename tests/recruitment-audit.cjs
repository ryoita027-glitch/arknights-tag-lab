"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const input=process.argv[2]||"index.html";
const html=fs.readFileSync(input,"utf8");
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert(scripts.length>0,"main javascript not found");
const js=scripts[0][1].replace("loadState();bind();render();","");
const sandbox={window:{},document:{},localStorage:{getItem(){return null},setItem(){}},console,setTimeout,clearTimeout};
vm.createContext(sandbox);vm.runInContext(js,sandbox,{timeout:15000});
const {OPERATORS,ALL_TAGS,opCandidates,collectCombinations}=sandbox.window.RecruitTagLab;
assert.equal(OPERATORS.length,158);
assert.equal(ALL_TAGS.length,29);
assert.equal(new Set(OPERATORS.map(x=>x.n)).size,158);
assert.deepEqual([1,2,3,4,5,6].map(n=>OPERATORS.filter(x=>x.s===n).length),[8,5,16,41,54,34]);
assert.deepEqual([...opCandidates(["ロボット","弱化"],"robot")].map(x=>x.n),["GALLUS²"]);
assert.deepEqual([...opCandidates(["元素"],"robot")].map(x=>x.n),["PhonoR-0"]);
assert.equal(opCandidates(["上級エリート"],"normal").length,34);
assert.equal(opCandidates(["エリート"],"normal").length,54);
assert.equal(opCandidates(["ロボット"],"normal").length,0);
assert.equal(opCandidates(["ロボット"],"robot").length,8);
assert(opCandidates(["召喚"],"normal").some(x=>x.n==="ビーンストーク"));
assert.equal(opCandidates(["近距離","COST回復","治療"],"normal").map(x=>x.n).join(","),"テンニンカ");
let tested=0;
for(const mode of ["normal","robot"]){
for(let i=0;i<ALL_TAGS.length;i++){
const choices=[[ALL_TAGS[i]]];
for(let j=i+1;j<ALL_TAGS.length;j++){
 choices.push([ALL_TAGS[i],ALL_TAGS[j]]);
 for(let k=j+1;k<ALL_TAGS.length;k++)choices.push([ALL_TAGS[i],ALL_TAGS[j],ALL_TAGS[k]]);
}
for(const tags of choices){
 tested++;
 const ops=opCandidates(tags,mode);
 const top=tags.includes("上級エリート"),senior=tags.includes("エリート");
 for(const op of ops){
  assert(tags.every(t=>op.ts.has(t)),`Missing tag: ${op.n}: ${tags}`);
  assert(mode==="normal"?(op.s>=3&&(op.s!==6||top)):(op.s>=1&&op.s<=4),`Bad range: ${op.n}`);
  assert(!top||op.s===6);
  assert(!senior||op.s===5);
 }
}
}}
assert.equal(tested,8178);
assert.equal(collectCombinations(["上級エリート","前衛","近距離","火力","支援"],"normal").list[0].score.min,6);
// White Wiki links: complete, unique, HTTPS-only, and safe for opening in a new tab.
const wikiUrls=OPERATORS.map(op=>op.u);
assert.equal(wikiUrls.length,158);
assert.equal(new Set(wikiUrls).size,158);
for(const op of OPERATORS) {
  assert.match(op.u,/^https:\/\/arknights\.wikiru\.jp\/(?:index\.php)?\?[^#\s]+$/);
  const chip=vm.runInContext("opChip(SAFE_OPS.find(o=>o.n==="+JSON.stringify(op.n)+"))",sandbox);
  assert(chip.includes('href="'+op.u+'"'),"Wrong page: "+op.n);
  assert(chip.includes('target="_blank"')&&chip.includes('rel="noopener noreferrer"'));
}
assert(html.includes("wikiLink(op,'operator-wiki-link')"),"The reverse index must link to Wiki");
assert(html.includes("wikiLink(op,'preview-wiki-link')"),"Collapsed candidate names must link to Wiki");
console.log("PASS: 158 operators, 29 tags, 8178 combinations and 158 White Wiki URLs");
