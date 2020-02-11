import { ComponentRenderProxy } from '@vue/composition-api'
import Vue, { VNode } from 'vue'

declare global {
  const __DEV__: boolean
  const __SERVER__: boolean
  const SERVER_PREFIX: boolean

  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Element extends VNode {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props: unknown // specify the property name to use
    }
    interface IntrinsicElements {
      [elem: string]: unknown
    }
  }
}

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: {
      [key: string]: Vue | Element | Vue[] | Element[]
    }
  }
}
