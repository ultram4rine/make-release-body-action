const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function run() {
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
    for await (const line of rl) {
      if (line.startsWith("## [")) {
        if (line.startsWith(`## [${version}]`)) {
          startRecord = true;
        } else if (startRecord) {
          startRecord = false;
          // Stop because we found next version header.
          rl.close();
          rl.removeAllListeners();
        }
      } else {
        if (startRecord) {
          changes = changes.concat(line, "\n");
        }
      }
    }

    core.setOutput("changes", changes);

    if (output) {
      fs.writeFileSync(output, changes, { flag: "a" });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
