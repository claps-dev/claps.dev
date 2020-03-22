import Clipboard from 'clipboard'
import Vue, { DirectiveFunction, DirectiveOptions } from 'vue'

export interface ClipboardEl extends HTMLElement {
  $$clipboard?: Clipboard
  $$clipboardValue?: string
}

const bind: DirectiveFunction = (
  el,
  { value }: { value?: string },
  { componentInstance },
) => {
  const $$clipboard = new Clipboard(el, {
    text: () => (el as ClipboardEl).$$clipboardValue,
  })
  Object.assign(el, {
    $$clipboardValue: value,
    $$clipboard,
  })
  $$clipboard.on('success', e => {
    if (componentInstance) {
      componentInstance.$emit('clipboard-success', e)
    }
  })
  $$clipboard.on('error', e => {
    if (componentInstance) {
      componentInstance.$emit('clipboard-error', e)
    }
  })
}

const destroy = (el: ClipboardEl) => {
  const { $$clipboard } = el
  if (!$$clipboard) {
    return
  }
  $$clipboard.destroy()
}

export const VueClipboard: DirectiveOptions = {
  inserted: bind,
  update(el, { value }: { value?: string }) {
    Object.assign(el, {
      $$clipboardValue: value,
    })
  },
  unbind: destroy,
}

Vue.directive('clipboard', VueClipboard)
