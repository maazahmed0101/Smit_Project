import { createRequire } from "node:module";
const require = createRequire("/home/claude/.npm-global/lib/node_modules/tsx/");
const esbuild = require("esbuild");
const G = "/home/claude/.npm-global/lib/node_modules";
const r = await esbuild.build({
  entryPoints: ["/home/claude/play-app/src/main.jsx"],
  bundle: true, outdir: "/tmp/harness/dist", format: "esm", jsx: "automatic", sourcemap: false,
  alias: { "react-router-dom": "/tmp/harness/router-shim.jsx", react: G + "/react", "react-dom": G + "/react-dom" },
  loader: { ".js": "jsx" }, logLevel: "warning", define: { "process.env.NODE_ENV": '"development"' },
});
console.log("build ok", r.errors.length, "errors");
