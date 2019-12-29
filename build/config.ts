const DEV = 'development'
const PROD = 'production'

type NodeEnv = typeof DEV | typeof PROD

export const NODE_ENV = (process.env.NODE_ENV as NodeEnv) || DEV

export const __DEV__ = NODE_ENV === DEV
export const __PROD__ = NODE_ENV === PROD

export const serverHost = process.env.HOST || '0.0.0.0'
export const serverPort = +process.env.PORT || 3000

export const innerServer = `http://localhost:${serverPort}/`
