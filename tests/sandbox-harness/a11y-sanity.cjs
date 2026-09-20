const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const routes=["/","/search?q=react","/watch/lex-red-dead","/channel/yash-mittal","/channel/yash-mittal/tweets","/playlist/react-from-zero","/collection","/history","/liked","/subscribers","/settings","/support","/my-content"];
for(const r of routes){await p.goto("http://localhost:4173"+r);await p.waitForTimeout(300);
const issues=await p.evaluate(()=>{const out=[];const name=(el)=>(el.getAttribute("aria-label")||el.textContent||el.getAttribute("title")||"").trim();
document.querySelectorAll("button,a[href]").forEach(e=>{if(!name(e)&&!e.querySelector("img[alt]:not([alt=''])"))out.push("noname:"+e.outerHTML.slice(0,80));});
document.querySelectorAll("input,textarea").forEach(e=>{const id=e.id;const lab=id&&document.querySelector(`label[for="${id}"]`);if(!lab&&!e.getAttribute("aria-label"))out.push("nolabel:"+e.outerHTML.slice(0,80));});
if(document.querySelectorAll("h1").length!==1)out.push("h1 count "+document.querySelectorAll("h1").length);
if(!document.querySelector("main"))out.push("no main");return out;});
console.log(r,issues.length?issues:"ok");}
// keyboard: tab through home, focus visible, enter on card link
await p.goto("http://localhost:4173/");await p.keyboard.press("Tab");console.log("first focus:",await p.evaluate(()=>document.activeElement.textContent.trim()));
await b.close();})();
