const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

try {
  const changelog = core.getInput("changelog");
  const version = core.getInput("version");
  const output = core.getInput("output");
  console.log(`Proceed ${changelog} at ${version}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(path.resolve(changelog)),
  });

  let changes = "";
  let startRecord = false;
  rl.on("line", (line) => {
    if (line.startsWith("## [")) {
      if (line.startsWith(`## [${version}]`)) {
        startRecord = true;
      } else if (startRecord) {
        // Stop because we found next version header.
        rl.close();
      }
    } else {
      if (startRecord) {
        changes = changes.concat(line);
      }
    }
  });

  core.setOutput("changes", changes);

  if (output) {
    fs.writeFileSync(output, changes, { flag: "a" });
  }
} catch (error) {
  core.setFailed(error.message);
}
