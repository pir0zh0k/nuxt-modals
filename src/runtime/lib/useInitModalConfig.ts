import type { Component } from 'vue'
import type { IModalConfig, IModalVariant } from './types'

let modalConfig: IModalConfig | null = null
let modalVariants: Record<string, IModalVariant> = {}
let isInitialized = false

/**
 * Инициализирует конфигурацию модальных окон.
 * Реализует паттерн Singleton - инициализация происходит только один раз.
 *
 * @param config - Конфигурация модальных окон
 * @param variants - Массив вариантов оберток модальных окон
 * @returns Инициализированную конфигурацию
 */
export const useInitModalConfig = <
  TConfig extends IModalConfig,
  TVariants extends readonly IModalVariant[] | IModalVariant[],
>(
  config: TConfig,
  variants: TVariants
): TConfig => {
  if (isInitialized) {
    return modalConfig! as TConfig
  }

  modalConfig = config
  modalVariants = (variants as IModalVariant[]).reduce(
    (acc, variant) => {
      acc[variant.key] = variant
      return acc
    },
    {} as Record<string, IModalVariant>
  )
  isInitialized = true

  return config
}

/**
 * Возвращает текущую конфигурацию модальных окон.
 *
 * @returns Конфигурация модальных окон или null, если конфигурация не инициализирована
 */
export const getModalConfig = (): IModalConfig | null => {
  return modalConfig
}

/**
 * Возвращает компонент обертки модального окна по ключу модального окна.
 *
 * @param key - Ключ модального окна из конфигурации
 * @returns Компонент обертки модального окна или null, если не найден
 */
export const getModalComponent = (key: string): Component | null => {
  if (!isInitialized || !modalConfig) {
    return null
  }

  const configItem = modalConfig[key]
  if (!configItem) {
    return null
  }

  const variant = modalVariants[configItem.variant]
  return variant?.component || null
}

/**
 * Возвращает внутренний компонент модального окна по ключу.
 *
 * @param key - Ключ модального окна из конфигурации
 * @returns Внутренний компонент модального окна или null, если не найден
 */
export const getModalInnerComponent = (key: string): Component | null => {
  if (!isInitialized || !modalConfig) {
    return null
  }

  const configItem = modalConfig[key]
  return configItem?.component || null
}

/**
 * Проверяет, инициализирована ли конфигурация модальных окон.
 *
 * @returns true, если конфигурация инициализирована, иначе false
 */
export const isModalConfigInitialized = (): boolean => {
  return isInitialized
}

/**
 * Сбрасывает конфигурацию модальных окон.
 * Используется для тестирования или переинициализации.
 */
export const resetModalConfig = (): void => {
  modalConfig = null
  modalVariants = {}
  isInitialized = false
}
