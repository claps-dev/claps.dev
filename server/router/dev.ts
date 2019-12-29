import { exec } from 'child_process'

import consola from 'consola'

import { serverPort } from '../../build/config'

import startRouter from '.'

exec(
  `kill -9 $(lsof -i:${serverPort + 1} -t) 2> /dev/null`,
  (_code, _stdout, stderr) => {
    if (stderr) {
      consola.error(stderr)
      return
    }

    startRouter()
  },
)
