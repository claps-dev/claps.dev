const fs = require('fs')

const { tryFile } = require('@pkgr/utils')
const { parse } = require('dotenv')

const localEnvFile = tryFile('.env.local')

let localEnv

if (localEnvFile) {
  localEnv = parse(fs.readFileSync(localEnvFile))
}

module.exports = {
  PARSER_NO_WATCH: true,
  TS_NODE_FILES: true,
  ...localEnv,
}
