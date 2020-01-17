import Clipboard from 'clipboard'
import Vue, { DirectiveOptions, DirectiveFunction, VNode } from 'vue'

export interface ClipboardVm extends Vue {
  $$clipboard?: Clipboard
  $$clipboardValue?: string
}

const bind: DirectiveFunction = (
  el,
  { value },
  { context, componentInstance },
  _oldVNode,
) => {
  const $$clipboard = new Clipboard(el, {
    text: () => (context as ClipboardVm).$$clipboardValue,
  })
  Object.assign(context, {
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

const destroy = (vnode: VNode) => {
  const { $$clipboard } = vnode.context as ClipboardVm
  if (!$$clipboard) {
    return
  }
  $$clipboard.destroy()
}

export const VueClipboard: DirectiveOptions = {
  inserted: bind,
  update(_el, { value }, { context }) {
    Object.assign(context, {
      $$clipboardValue: value,
    })
  },
  unbind(_el, _binding, vnode) {
    destroy(vnode)
  },
}

Vue.directive('clipboard', VueClipboard)
