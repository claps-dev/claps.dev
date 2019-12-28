declare module 'nuxt' {
  import { IncomingMessage, ServerResponse } from 'http'

  import { Configuration } from '@nuxt/types'

  export class Nuxt {
    options: Configuration

    constructor(config: Configuration)

    ready(): Promise<void>

    render(req: IncomingMessage, res: ServerResponse, next?: () => void): void
  }

  export class Builder {
    constructor(nuxt: Nuxt)

    build(): Promise<void>
  }
}
