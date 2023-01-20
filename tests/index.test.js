const process = require("process");
const cp = require("child_process");
const path = require("path");

// shows how the runner will run a javascript action with env / stdout protocol
test("test runs", () => {
  process.env["INPUT_CHANGELOG"] = "./tests/changelog";
  process.env["INPUT_VERSION"] = "1.0.0";
  process.env["INPUT_OUTPUT"] = "./tests/changes.txt";
  const ip = path.join(__dirname, "../lib/index.js");
  const result = cp.execSync(`node ${ip}`, { env: process.env }).toString();
  console.log(result);
});
