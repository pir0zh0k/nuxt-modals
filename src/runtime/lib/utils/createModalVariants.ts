import type { IModalVariant } from "../types";

/**
 * Создает типизированный массив вариантов модальных окон.
 * Помогает TypeScript вывести конкретные типы ключей.
 *
 * @param variants - Массив вариантов модальных окон
 * @returns Типизированный массив вариантов
 */
export function createModalVariants<
  const TVariants extends readonly IModalVariant[],
>(variants: TVariants): TVariants {
  return variants
}