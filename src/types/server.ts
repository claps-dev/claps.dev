export interface SetCookie {
  name: string
  value: string
  path?: string
  expires?: string
  httponly?: boolean
}

export type Project = import('@@/server/entities').Project
