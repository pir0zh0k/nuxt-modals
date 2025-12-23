import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import type { Component } from 'vue'
import { useModal, resetOpenedModal } from '../src/runtime/lib/useModal'
import {
  useInitModalConfig,
  resetModalConfig,
} from '../src/runtime/lib/useInitModalConfig'
import type { IModalConfig, IModalVariant } from '../src/runtime/lib/types'

// Mock компоненты Vue
const MockWrapperComponent: Component = {
  name: 'MockWrapper',
  template: '<div>Wrapper</div>',
}

const MockInnerComponent1: Component = {
  name: 'MockInner1',
  template: '<div>Inner1</div>',
}

const MockInnerComponent2: Component = {
  name: 'MockInner2',
  template: '<div>Inner2</div>',
}

describe('useModal', () => {
  beforeEach(() => {
    resetModalConfig()
    resetOpenedModal()
  })

  describe('инициализация', () => {
    it('должен создать композабл с нужными методами', () => {
      const { open, close, openedModal } = useModal()

      expect(typeof open).toBe('function')
      expect(typeof close).toBe('function')
      expect(openedModal.value).toBe(null)
    })
  })

  describe('open', () => {
    it('не должен открывать модальное окно до инициализации конфигурации', () => {
      const { open, openedModal } = useModal()

      open({ key: 'auth' as const })

      expect(openedModal.value).toBe(null)
    })

    it('должен открыть модальное окно после инициализации конфигурации', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, openedModal } = useModal()

      open({ key: 'auth' as const })
      await nextTick()

      expect(openedModal.value).not.toBe(null)
      expect(openedModal.value?.key).toBe('auth')
      expect(openedModal.value?.props).toBeUndefined()
    })

    it('должен открыть модальное окно с переданными свойствами', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, openedModal } = useModal()

      const props = { email: 'test@example.com', title: 'Login' }
      open({ key: 'auth' as const, props })
      await nextTick()

      expect(openedModal.value).not.toBe(null)
      expect(openedModal.value?.key).toBe('auth')
      expect(openedModal.value?.props).toEqual(props)
    })

    it('не должен открыть модальное окно с несуществующим ключом', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, openedModal } = useModal()

      open({ key: 'nonexistent' })
      await nextTick()

      expect(openedModal.value).toBe(null)
    })

    it('должен перезаписать текущее модальное окно при открытии нового', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
        register: {
          variant: 'base',
          component: MockInnerComponent2,
        },
      }

      useInitModalConfig(config, variants)

      const { open, openedModal } = useModal()

      open({ key: 'auth' as const })
      await nextTick()
      expect(openedModal.value?.key).toBe('auth')

      open({ key: 'register' as const })
      await nextTick()
      expect(openedModal.value?.key).toBe('register')
    })

    it('должен вызвать callback при успешном открытии модального окна', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, openedModal } = useModal()
      const onOpenCallback = vi.fn()

      open({ key: 'auth' as const }, onOpenCallback)
      await nextTick()

      expect(openedModal.value).not.toBe(null)
      expect(onOpenCallback).toHaveBeenCalledOnce()
    })

    it('не должен вызвать callback, если модальное окно не открылось', () => {
      const { open } = useModal()
      const onOpenCallback = vi.fn()

      open({ key: 'auth' as const }, onOpenCallback)

      expect(onOpenCallback).not.toHaveBeenCalled()
    })
  })

  describe('close', () => {
    it('должен закрыть открытое модальное окно', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, close, openedModal } = useModal()

      open({ key: 'auth' as const })
      await nextTick()
      expect(openedModal.value).not.toBe(null)

      close()
      await nextTick()
      expect(openedModal.value).toBe(null)
    })

    it('не должен вызвать ошибку при закрытии, когда модальное окно не открыто', () => {
      const { close, openedModal } = useModal()

      expect(openedModal.value).toBe(null)

      expect(() => close()).not.toThrow()
      expect(openedModal.value).toBe(null)
    })

    it('должен вызвать callback при закрытии модального окна', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, close, openedModal } = useModal()
      const onCloseCallback = vi.fn()

      open({ key: 'auth' as const })
      await nextTick()
      expect(openedModal.value).not.toBe(null)

      close(onCloseCallback)
      await nextTick()

      expect(openedModal.value).toBe(null)
      expect(onCloseCallback).toHaveBeenCalledOnce()
    })

    it('должен вызвать callback при закрытии, даже когда модальное окно не открыто', () => {
      const { close } = useModal()
      const onCloseCallback = vi.fn()

      close(onCloseCallback)

      expect(onCloseCallback).toHaveBeenCalledOnce()
    })
  })

  describe('openedModal', () => {
    it('должен быть реактивной ссылкой', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, close, openedModal } = useModal()

      expect(openedModal.value).toBe(null)

      open({ key: 'auth' as const })
      await nextTick()
      expect(openedModal.value).not.toBe(null)

      close()
      await nextTick()
      expect(openedModal.value).toBe(null)
    })

    it('должен содержать правильную структуру данных', async () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      const { open, openedModal } = useModal()

      const props = { test: 'value' }
      open({ key: 'auth' as const, props })
      await nextTick()

      expect(openedModal.value).toHaveProperty('key')
      expect(openedModal.value).toHaveProperty('props')
      expect(openedModal.value?.key).toBe('auth')
      expect(openedModal.value?.props).toEqual(props)
    })
  })
})
