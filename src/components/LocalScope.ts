import { VNode, FunctionalComponentOptions } from 'vue'

export const LocalScope: FunctionalComponentOptions = {
  functional: true,
  render: (_, { data: { scopedSlots }, props }) =>
    scopedSlots.default(props) as VNode | VNode[],
}
