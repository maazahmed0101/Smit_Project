const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");
(async () => {
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const B = "http://localhost:4173";
  const errs = [];
  // video playback
  let page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await page.goto(B + "/watch/how-to-learn-react"); await page.waitForSelector("video");
  await page.getByRole("button", { name: "Play", exact: false }).first().click();
  await page.waitForTimeout(1500);
  const st = await page.$eval("video", (v) => ({ t: v.currentTime, paused: v.paused, d: v.duration, src: v.currentSrc, err: v.error && v.error.code }));
  console.log("VIDEO", JSON.stringify(st));
  await page.getByRole("button", { name: "Pause" }).click();
  console.log("paused after click:", await page.$eval("video", (v) => v.paused));
  await page.locator(".player__progress").fill("6"); await page.waitForTimeout(200);
  console.log("seek ->", await page.$eval("video", (v) => Math.round(v.currentTime)));
  await page.getByRole("button", { name: "Mute" }).click();
  console.log("muted:", await page.$eval("video", (v) => v.muted));
  await page.close();

  // responsive overflow
  const routes = ["/", "/search?q=react", "/watch/lex-red-dead", "/channel/yash-mittal", "/channel/yash-mittal/tweets", "/playlist/react-from-zero", "/collection", "/history", "/subscribers", "/settings", "/support", "/zzz"];
  for (const w of [1440, 1366, 1024, 768, 390, 360]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    const bad = [];
    for (const r of routes) {
      await p.goto(B + r); await p.waitForTimeout(250);
      const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (o.sw > o.cw) bad.push(`${r} (${o.sw}>${o.cw})`);
    }
    console.log(`width ${w}: overflow on`, bad.length ? bad : "none");
    if (w === 390) {
      await p.goto(B + "/"); await p.waitForTimeout(600); await p.screenshot({ path: "m-home.png" });
      await p.goto(B + "/watch/lex-red-dead"); await p.waitForTimeout(600); await p.screenshot({ path: "m-watch.png" });
      await p.goto(B + "/channel/yash-mittal"); await p.waitForTimeout(600); await p.screenshot({ path: "m-channel.png" });
      // mobile search toggle + menu
      await p.goto(B + "/"); await p.getByRole("button", { name: "Open search" }).click();
      console.log("mobile search visible:", await p.getByRole("searchbox").isVisible());
      await p.getByRole("button", { name: "Menu" }).click(); console.log("mobile menu items:", await p.getByRole("menuitem").count());
    }
    await ctx.close();
  }
  console.log("errors:", errs);
  await browser.close();
})().catch((e) => { console.error("ERR", e); process.exit(1); });
