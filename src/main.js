const fs = require('fs')
const path = require('path')
const readline = require('readline')
const core = require('@actions/core')

async function run() {
  try {
    const changelog = core.getInput('changelog', { required: true })
    const version = core.getInput('version', { required: true })
    const output = core.getInput('output')

    core.info(`Proceed ${changelog} at ${version}`)

    const rl = readline.createInterface({
      input: fs.createReadStream(path.resolve(changelog))
    })

    let changes = ''
    let startRecord = false
    for await (const line of rl) {
      if (line.startsWith('## [')) {
        if (line.startsWith(`## [${version}]`)) {
          core.debug(`Found ${version} section`)
          startRecord = true
        } else if (startRecord) {
          core.debug('Stop processing changelog')
          startRecord = false
          // Stop because we found next version header.
          rl.close()
          rl.removeAllListeners()
        }
      } else {
        if (startRecord) {
          changes = changes.concat(line, '\n')
        }
      }
    }

    changes = changes.trim()
    core.debug(`Changes: ${changes}`)
    core.setOutput('changes', changes)

    if (output) {
      fs.writeFileSync(output, changes)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
