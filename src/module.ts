import {
  defineNuxtModule,
  createResolver,
  addImports,
  addComponent,
} from '@nuxt/kit'

export type * from './runtime/lib/types'

/**
 * Nuxt модуль для управления модальными окнами.
 * Регистрирует композаблы useModal и useInitModalConfig, а также компонент ModalContainer.
 */
export default defineNuxtModule({
  meta: {
    name: 'modals',
    configKey: 'modals',
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addImports({
      name: 'useModal',
      as: 'useModal',
      from: resolver.resolve('runtime/lib/useModal'),
    })

    addImports({
      name: 'useInitModalConfig',
      as: 'useInitModalConfig',
      from: resolver.resolve('runtime/lib/useInitModalConfig'),
    })

    addImports({
      name: 'createModalVariants',
      as: 'createModalVariants',
      from: resolver.resolve('runtime/lib/utils/createModalVariants'),
    })

    addImports({
      name: 'createModalConfig',
      as: 'createModalConfig',
      from: resolver.resolve('runtime/lib/utils/createModalConfig'),
    })

    addComponent({
      name: 'ModalContainer',
      filePath: resolver.resolve('runtime/components/ModalContainer.vue'),
      global: true,
    })
  },
})
