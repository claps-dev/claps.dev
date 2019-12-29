const fs = require('fs')

const { parse } = require('dotenv')

const LOCAL_ENV = '.env.local'

let localEnv

if (fs.existsSync(LOCAL_ENV)) {
  localEnv = parse(fs.readFileSync(LOCAL_ENV))
}

module.exports = {
  PARSER_NO_WATCH: true,
  TS_NODE_FILES: true,
  ...localEnv,
}
