import { describe, it, expect } from 'vitest'
import type { Component } from 'vue'
import {
  createModalVariants,
  createModalConfig,
} from '../src/runtime/lib/types'
import type { IModalVariant } from '../src/runtime/lib/types'

// Mock компоненты Vue
const MockWrapperComponent1: Component = {
  name: 'MockWrapper1',
  template: '<div>Wrapper1</div>',
}

const MockWrapperComponent2: Component = {
  name: 'MockWrapper2',
  template: '<div>Wrapper2</div>',
}

const MockInnerComponent1: Component = {
  name: 'MockInner1',
  template: '<div>Inner1</div>',
}

const MockInnerComponent2: Component = {
  name: 'MockInner2',
  template: '<div>Inner2</div>',
}

describe('createModalVariants', () => {
  it('должен вернуть тот же массив вариантов', () => {
    const variants: IModalVariant[] = [
      { key: 'base', component: MockWrapperComponent1 },
      { key: 'slim', component: MockWrapperComponent2 },
    ]

    const result = createModalVariants(variants)

    expect(result).toBe(variants)
    expect(result).toEqual(variants)
  })

  it('должен работать с readonly массивом', () => {
    const variants = [
      { key: 'base', component: MockWrapperComponent1 },
      { key: 'slim', component: MockWrapperComponent2 },
    ] as const

    const result = createModalVariants(variants)

    expect(result).toBe(variants)
  })

  it('должен сохранить все варианты', () => {
    const variants: IModalVariant[] = [
      { key: 'base', component: MockWrapperComponent1 },
      { key: 'slim', component: MockWrapperComponent2 },
    ]

    const result = createModalVariants(variants)

    expect(result).toHaveLength(2)
    expect(result[0]?.key).toBe('base')
    expect(result[1]?.key).toBe('slim')
    expect(result[0]?.component).toBe(MockWrapperComponent1)
    expect(result[1]?.component).toBe(MockWrapperComponent2)
  })

  it('должен работать с одним вариантом', () => {
    const variants: IModalVariant[] = [
      { key: 'base', component: MockWrapperComponent1 },
    ]

    const result = createModalVariants(variants)

    expect(result).toHaveLength(1)
    expect(result[0]?.key).toBe('base')
  })

  it('должен работать с пустым массивом', () => {
    const variants: IModalVariant[] = []

    const result = createModalVariants(variants)

    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })
})

describe('createModalConfig', () => {
  it('должен вернуть ту же конфигурацию', () => {
    const variants = createModalVariants([
      { key: 'base', component: MockWrapperComponent1 },
      { key: 'slim', component: MockWrapperComponent2 },
    ])

    const config = {
      auth: {
        variant: 'base' as const,
        component: MockInnerComponent1,
      },
      register: {
        variant: 'slim' as const,
        component: MockInnerComponent2,
      },
    }

    const result = createModalConfig(variants, config)

    expect(result).toBe(config)
    expect(result).toEqual(config)
  })

  it('должен проверить соответствие вариантов', () => {
    const variants = createModalVariants([
      { key: 'base', component: MockWrapperComponent1 },
      { key: 'slim', component: MockWrapperComponent2 },
    ])

    const config = {
      auth: {
        variant: 'base' as const,
        component: MockInnerComponent1,
      },
      register: {
        variant: 'slim' as const,
        component: MockInnerComponent2,
      },
    } as const

    const result = createModalConfig(variants, config)

    expect(result.auth?.variant).toBe('base')
    expect(result.register?.variant).toBe('slim')
    expect(result.auth?.component).toBe(MockInnerComponent1)
    expect(result.register?.component).toBe(MockInnerComponent2)
  })

  it('должен работать с одним модальным окном', () => {
    const variants = createModalVariants([
      { key: 'base', component: MockWrapperComponent1 },
    ])

    const config = {
      auth: {
        variant: 'base' as const,
        component: MockInnerComponent1,
      },
    }

    const result = createModalConfig(variants, config)

    expect(result).toEqual(config)
    expect(Object.keys(result)).toHaveLength(1)
  })

  it('должен работать с несколькими модальными окнами на один вариант', () => {
    const variants = createModalVariants([
      { key: 'base', component: MockWrapperComponent1 },
    ])

    const config = {
      auth: {
        variant: 'base' as const,
        component: MockInnerComponent1,
      },
      login: {
        variant: 'base' as const,
        component: MockInnerComponent2,
      },
    }

    const result = createModalConfig(variants, config)

    expect(result.auth?.variant).toBe('base')
    expect(result.login?.variant).toBe('base')
    expect(result.auth?.component).toBe(MockInnerComponent1)
    expect(result.login?.component).toBe(MockInnerComponent2)
  })
})
