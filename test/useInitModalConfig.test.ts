import { describe, it, expect, beforeEach } from 'vitest'
import type { Component } from 'vue'
import {
  useInitModalConfig,
  getModalConfig,
  getModalComponent,
  getModalInnerComponent,
  isModalConfigInitialized,
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

describe('useInitModalConfig', () => {
  beforeEach(() => {
    resetModalConfig()
  })

  describe('useInitModalConfig', () => {
    it('должен инициализировать конфигурацию', () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      const result = useInitModalConfig(config, variants)

      expect(result).toBe(config)
      expect(isModalConfigInitialized()).toBe(true)
    })

    it('должен реализовать паттерн Singleton', () => {
      const variants1: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config1: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      const variants2: IModalVariant[] = [
        { key: 'slim', component: MockWrapperComponent },
      ]

      const config2: IModalConfig = {
        register: {
          variant: 'slim',
          component: MockInnerComponent2,
        },
      }

      const result1 = useInitModalConfig(config1, variants1)
      const result2 = useInitModalConfig(config2, variants2)

      expect(result1).toBe(config1)
      expect(result2).toBe(config1)
      expect(result2).not.toBe(config2)
      expect(getModalConfig()).toBe(config1)
    })

    it('должен обработать readonly массив вариантов', () => {
      const variants = [
        { key: 'base', component: MockWrapperComponent },
      ] as const

      const config: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      const result = useInitModalConfig(config, variants)

      expect(result).toBe(config)
      expect(isModalConfigInitialized()).toBe(true)
    })
  })

  describe('getModalConfig', () => {
    it('должен вернуть null до инициализации', () => {
      expect(getModalConfig()).toBe(null)
    })

    it('должен вернуть конфигурацию после инициализации', () => {
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

      expect(getModalConfig()).toBe(config)
    })
  })

  describe('getModalComponent', () => {
    it('должен вернуть null до инициализации', () => {
      expect(getModalComponent('auth')).toBe(null)
    })

    it('должен вернуть компонент обертки по ключу модального окна', () => {
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

      const component = getModalComponent('auth')
      expect(component).toBe(MockWrapperComponent)
    })

    it('должен вернуть null для несуществующего ключа', () => {
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

      expect(getModalComponent('nonexistent')).toBe(null)
    })

    it('должен вернуть null для несуществующего варианта', () => {
      const variants: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config: IModalConfig = {
        auth: {
          variant: 'nonexistent',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config, variants)

      expect(getModalComponent('auth')).toBe(null)
    })
  })

  describe('getModalInnerComponent', () => {
    it('должен вернуть null до инициализации', () => {
      expect(getModalInnerComponent('auth')).toBe(null)
    })

    it('должен вернуть внутренний компонент по ключу модального окна', () => {
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

      const component = getModalInnerComponent('auth')
      expect(component).toBe(MockInnerComponent1)
    })

    it('должен вернуть null для несуществующего ключа', () => {
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

      expect(getModalInnerComponent('nonexistent')).toBe(null)
    })
  })

  describe('isModalConfigInitialized', () => {
    it('должен вернуть false до инициализации', () => {
      expect(isModalConfigInitialized()).toBe(false)
    })

    it('должен вернуть true после инициализации', () => {
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

      expect(isModalConfigInitialized()).toBe(true)
    })
  })

  describe('resetModalConfig', () => {
    it('должен сбросить конфигурацию', () => {
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
      expect(isModalConfigInitialized()).toBe(true)
      expect(getModalConfig()).toBe(config)

      resetModalConfig()

      expect(isModalConfigInitialized()).toBe(false)
      expect(getModalConfig()).toBe(null)
      expect(getModalComponent('auth')).toBe(null)
      expect(getModalInnerComponent('auth')).toBe(null)
    })

    it('должен позволить повторную инициализацию после сброса', () => {
      const variants1: IModalVariant[] = [
        { key: 'base', component: MockWrapperComponent },
      ]

      const config1: IModalConfig = {
        auth: {
          variant: 'base',
          component: MockInnerComponent1,
        },
      }

      useInitModalConfig(config1, variants1)
      resetModalConfig()

      const variants2: IModalVariant[] = [
        { key: 'slim', component: MockWrapperComponent },
      ]

      const config2: IModalConfig = {
        register: {
          variant: 'slim',
          component: MockInnerComponent2,
        },
      }

      const result = useInitModalConfig(config2, variants2)

      expect(result).toBe(config2)
      expect(getModalConfig()).toBe(config2)
    })
  })
})
