const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(m.type() + ": " + m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => errors.push("reqfail: " + r.url() + " " + r.failure().errorText));
  const ok = (name, cond) => console.log((cond ? "PASS " : "FAIL ") + name);
  const B = "http://localhost:4173";

  await page.goto(B + "/"); await page.waitForSelector(".vcard");
  ok("home renders cards", (await page.locator(".vcard--grid").count()) >= 12);
  await page.screenshot({ path: "home.png" });

  // Flow 1: home -> watch
  await page.locator(".vcard--grid .vcard__title a").first().click();
  await page.waitForSelector(".watch");
  ok("watch route", page.url().includes("/watch/how-to-learn-react"));
  ok("watch title", (await page.locator(".watch__title").innerText()).includes("React Roadmap"));
  // guest like -> auth modal
  await page.getByRole("button", { name: /^Like/ }).click();
  ok("guest like opens auth modal", await page.getByRole("dialog").isVisible());
  await page.getByRole("button", { name: /Continue as demo user/ }).click();
  await page.waitForTimeout(300);
  ok("pending like applied after login", (await page.getByRole("button", { name: /^Like/ }).getAttribute("aria-pressed")) === "true");
  // Flow 5 follow
  await page.getByRole("button", { name: "Follow" }).count().then(async (n) => console.log("follow btn count (own channel hidden expected 0):", n));
  await page.screenshot({ path: "watch.png" });
  // history
  await page.goto(B + "/history"); await page.waitForSelector(".vcard--row");
  ok("history has watched video", (await page.locator(".vcard--row").count()) === 1);
  // liked page persists after reload
  await page.goto(B + "/liked"); await page.waitForSelector(".vcard");
  ok("liked page shows liked video after reload", (await page.locator(".vcard--grid").count()) === 1);

  // other video: follow, save, watch later, comment
  await page.goto(B + "/watch/70m-views"); await page.waitForSelector(".watch");
  await page.getByRole("button", { name: "Follow" }).click();
  ok("follow -> Following", (await page.getByRole("button", { name: "Following" }).count()) === 1);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  ok("save modal", await page.getByRole("dialog", { name: "Save to playlist" }).isVisible());
  await page.getByLabel("Watch later").check();
  await page.getByPlaceholder("Playlist name").fill("My Faves");
  await page.getByRole("button", { name: "Create" }).click();
  ok("new playlist row", (await page.getByLabel("My Faves").count()) === 1);
  await page.keyboard.press("Escape");
  ok("esc closes modal", (await page.getByRole("dialog").count()) === 0);
  await page.getByPlaceholder("Add a Comment").fill("Nice one!");
  await page.getByRole("button", { name: "Comment", exact: true }).click();
  ok("comment added", (await page.locator(".comment", { hasText: "Nice one!" }).count()) === 1);
  ok("comment count", (await page.locator(".comments__title").innerText()).startsWith("241"));
  await page.goto(B + "/collection"); await page.waitForSelector(".plcard");
  ok("collection has 2 playlists", (await page.locator(".plcard").count()) === 2);
  await page.goto(B + "/subscribers"); await page.waitForSelector("h1");
  ok("subscribers lists Arnau", (await page.getByText("Arnau Ros").count()) >= 1);
  await page.getByRole("button", { name: "Following" }).click();
  ok("unfollow -> empty", (await page.getByText("No people subscribed").count()) === 1);

  // search
  await page.getByRole("searchbox").fill("react"); await page.keyboard.press("Enter");
  await page.waitForSelector(".search__list");
  ok("search url", page.url().endsWith("/search?q=react"));
  ok("search results >=2", (await page.locator(".vcard--row").count()) >= 2);
  await page.screenshot({ path: "search.png" });
  await page.getByRole("searchbox").fill("zzzzqq"); await page.keyboard.press("Enter");
  await page.waitForSelector(".empty");
  ok("search empty state", (await page.getByText("No videos available").count()) === 1);
  await page.goBack(); await page.waitForSelector(".search__list");
  ok("back restores results", page.url().endsWith("q=react"));

  // channel + tabs
  await page.goto(B + "/channel/yash-mittal"); await page.waitForSelector(".chead");
  ok("channel videos", (await page.locator(".vcard--channel").count()) === 7);
  await page.screenshot({ path: "channel.png" });
  await page.getByRole("link", { name: "Tweets" }).click(); await page.waitForSelector(".tweet");
  ok("tweets tab", (await page.locator(".tweet").count()) === 5);
  await page.getByRole("link", { name: "Following" }).click();
  ok("following empty", (await page.getByText("No people subscribed").count()) === 1);
  await page.goto(B + "/channel/yash-mittal/nope"); await page.waitForTimeout(300);
  ok("bad tab redirects", page.url().endsWith("/channel/yash-mittal"));

  // my content (demo = yash) composer
  await page.goto(B + "/my-content/tweets"); await page.waitForSelector(".tweets__composer");
  await page.getByPlaceholder("Write an announcement").fill("Hello world");
  await page.getByRole("button", { name: "Send" }).click();
  ok("announcement posted", (await page.locator(".tweet", { hasText: "Hello world" }).count()) === 1);
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Channel name").fill("Yash M"); await page.getByRole("button", { name: "Save changes" }).click();
  ok("edit profile", (await page.locator(".chead__name").innerText()) === "Yash M");

  // playlist page, invalid ids, 404
  await page.goto(B + "/playlist/react-from-zero"); await page.waitForSelector(".plpage");
  ok("playlist rows", (await page.locator(".vcard--row").count()) === 7);
  await page.goto(B + "/playlist/nope"); ok("playlist invalid", (await page.getByText("Playlist not found").count()) === 1);
  await page.goto(B + "/watch/nope"); ok("video invalid", (await page.getByText("Video not found").count()) === 1);
  await page.goto(B + "/channel/nope"); ok("channel invalid", (await page.getByText("Channel not found").count()) === 1);
  await page.goto(B + "/zzz"); ok("404", (await page.getByText("404 - Page not found").count()) === 1);

  // corrupt localStorage
  await page.evaluate(() => { localStorage.setItem("play:liked", "{oops"); localStorage.setItem("play:playlists", JSON.stringify([{ id: 1 }])); localStorage.setItem("play:history", "42"); });
  await page.goto(B + "/collection"); await page.waitForSelector(".plcard");
  ok("corrupt storage handled", (await page.locator(".plcard").count()) === 1);

  console.log("---- console errors/warnings:", errors.length); errors.slice(0, 15).forEach((e) => console.log(e));
  await browser.close();
})().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(1); });
