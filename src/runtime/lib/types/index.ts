import type { Component } from 'vue'

/**
 * Тип для массива вариантов модальных окон.
 */
export type ModalVariantsType = readonly IModalVariant[] | IModalVariant[]

/**
 * Интерфейс открытого модального окна.
 *
 * @template TKey - Тип ключа модального окна
 * @template TProps - Тип свойств, передаваемых в модальное окно
 */
export interface IOpenedModal<
  TKey extends string = string,
  TProps extends object | null | undefined = object | null | undefined,
> {
  /** Ключ модального окна из конфигурации */
  key: TKey
  /** Опциональные свойства для передачи в модальное окно */
  props?: TProps
}

/**
 * Интерфейс полезной нагрузки для открытия модального окна.
 *
 * @template TKey - Тип ключа модального окна
 * @template TProps - Тип свойств, передаваемых в модальное окно
 */
export interface IUseModalPayload<
  TKey extends string = string,
  TProps extends object | null = null,
> {
  /** Ключ модального окна из конфигурации */
  key: TKey
  /** Опциональные свойства для передачи в модальное окно */
  props?: TProps
}

/**
 * Интерфейс варианта обертки модального окна.
 *
 * @template TKey - Тип ключа варианта
 */
export interface IModalVariant<TKey extends string = string> {
  /** Уникальный ключ варианта обертки */
  key: TKey
  /** Vue компонент обертки модального окна */
  component: Component
}

/**
 * Тип элемента конфигурации модального окна.
 *
 * @template TVariants - Тип массива вариантов модальных окон
 */
export type IModalConfigItem<
  TVariants extends ModalVariantsType = ModalVariantsType,
> = {
  /** Ключ варианта обертки из массива вариантов */
  variant: TVariants[number]['key']
  /** Vue компонент содержимого модального окна */
  component: Component
}

/**
 * Тип конфигурации модальных окон.
 *
 * @template TKeys - Тип ключей модальных окон
 * @template TVariants - Тип массива вариантов модальных окон
 */
export type IModalConfig<
  TKeys extends string = string,
  TVariants extends ModalVariantsType = ModalVariantsType,
> = {
  [K in TKeys]: IModalConfigItem<TVariants>
}

/**
 * Извлекает ключи вариантов из массива вариантов модальных окон.
 *
 * @template TVariants - Массив вариантов модальных окон
 */
export type ExtractVariantKeys<TVariants extends readonly IModalVariant[]> =
  TVariants[number]['key']

/**
 * Тип для создания типизированной конфигурации модальных окон.
 *
 * @template TVariants - Массив вариантов модальных окон
 * @template TConfig - Конфигурация модальных окон
 */
export type CreateModalConfig<
  TVariants extends readonly IModalVariant[],
  TConfig extends Record<
    string,
    { variant: ExtractVariantKeys<TVariants>; component: Component }
  > = Record<
    string,
    { variant: ExtractVariantKeys<TVariants>; component: Component }
  >,
> = TConfig

/**
 * Извлекает ключи из конфигурации модальных окон.
 *
 * @template TConfig - Конфигурация модальных окон
 */
export type ExtractConfigKeys<
  TConfig extends Record<string, { variant: string; component: Component }>,
> = keyof TConfig & string
