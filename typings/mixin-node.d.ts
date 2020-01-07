declare module 'mixin-node' {
  namespace Mixin {
    interface Options {
      client_id: string
    }
  }

  class Mixin {
    constructor(options: Mixin.Options)
  }

  export = Mixin
}
