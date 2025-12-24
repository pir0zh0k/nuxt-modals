import type { Component } from "vue";
import type { ExtractVariantKeys, IModalVariant } from "../types";

/**
 * Создает типизированную конфигурацию модальных окон.
 * Помогает TypeScript вывести конкретные типы ключей и обеспечить соответствие вариантам.
 *
 * @param variants - Массив вариантов модальных окон
 * @param config - Конфигурация модальных окон
 * @returns Типизированную конфигурацию модальных окон
 */
export function createModalConfig<
  TVariants extends readonly IModalVariant[],
  const TConfig extends Record<
    string,
    { variant: ExtractVariantKeys<TVariants>; component: Component }
  >,
>(variants: TVariants, config: TConfig): TConfig {
  return config
}