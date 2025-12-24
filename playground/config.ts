import BaseModal from './components/BaseModal.vue'
import BaseModalInner from './components/BaseModalInner.vue'
import SlimModal from './components/SlimModal.vue'

export const modalVariants = createModalVariants([
  {
    key: 'base',
    component: BaseModal,
  },
  {
    key: 'slim',
    component: SlimModal,
  },
])

export const modalConfig = createModalConfig(modalVariants, {
  auth: {
    variant: 'base',
    component: BaseModalInner,
  },
  register: {
    variant: 'slim',
    component: BaseModalInner,
  },
})
