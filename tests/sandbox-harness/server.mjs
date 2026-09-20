import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const types = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webm": "video/webm", ".mp4": "video/mp4", ".html": "text/html" };
const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/main.css"><title>PLAY</title></head><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>`;
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  for (const root of ["/tmp/harness/dist", "/home/claude/play-app/public"]) {
    const f = path.join(root, url);
    if (url !== "/" && f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) {
      const stat = fs.statSync(f); const range = req.headers.range;
      const type = types[path.extname(f)] || "application/octet-stream";
      if (range) { const [s, e] = range.replace("bytes=", "").split("-"); const start = +s; const end = e ? +e : stat.size - 1;
        res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
        return fs.createReadStream(f, { start, end }).pipe(res); }
      res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size, "Accept-Ranges": "bytes" });
      return fs.createReadStream(f).pipe(res);
    }
  }
  res.writeHead(200, { "Content-Type": "text/html" }); res.end(html);
}).listen(4173, () => console.log("listening 4173"));
