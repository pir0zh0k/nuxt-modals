import { ref } from 'vue'
import type { IModalConfig, IOpenedModal, IUseModalPayload } from './types'
import {
  getModalComponent,
  isModalConfigInitialized,
  getModalConfig,
} from './useInitModalConfig'

const openedModal = ref<IOpenedModal | null>(null)

/**
 * Сбрасывает состояние открытого модального окна.
 * Используется для тестирования.
 */
export const resetOpenedModal = (): void => {
  openedModal.value = null
}

/**
 * Композабл для управления модальными окнами.
 * Предоставляет функции для открытия и закрытия модальных окон.
 *
 * @returns Объект с функциями управления модальными окнами
 */
export const useModal = () => {
  /**
   * Открывает модальное окно с указанным ключом и свойствами.
   *
   * @param payload - Полезная нагрузка с ключом модального окна и опциональными свойствами
   * @param onOpen - Опциональный callback, который вызывается после успешного открытия модального окна
   */
  const open = <
    TProps extends object | null = null,
    TConfig extends IModalConfig | object = object,
  >(
    payload: IUseModalPayload<keyof TConfig & string, TProps>,
    onOpen?: () => void
  ) => {
    if (!isModalConfigInitialized()) {
      return
    }

    const config = getModalConfig()
    if (!config || !(payload.key in config)) {
      return
    }

    const component = getModalComponent(payload.key)

    if (!component) {
      return
    }

    openedModal.value = {
      key: payload.key,
      props: payload.props,
    }

    if (onOpen) {
      onOpen()
    }
  }

  /**
   * Закрывает текущее открытое модальное окно.
   *
   * @param onClose - Опциональный callback, который вызывается после закрытия модального окна
   */
  const close = (onClose?: () => void) => {
    openedModal.value = null

    if (onClose) {
      onClose()
    }
  }

  return {
    openedModal,
    open,
    close,
  }
}
