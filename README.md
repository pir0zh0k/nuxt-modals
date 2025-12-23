# @pir0zh0k/nuxt-modals

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Типизированная система управления модальными окнами для Nuxt 3/4 с поддержкой TypeScript и SSR.

## ✨ Особенности

- 🎯 **Типобезопасность** - Полная поддержка TypeScript с автоматическим выводом типов
- 🔄 **Паттерн Singleton** - Инициализация конфигурации происходит только один раз
- 🎨 **Гибкая архитектура** - Разделение оберток (variants) и содержимого модальных окон
- 🚀 **SSR совместимость** - Работает как на сервере, так и на клиенте
- 📦 **Автоматическая регистрация** - Композаблы и компоненты регистрируются автоматически

## 📦 Установка

Установите модуль в ваше Nuxt приложение:

```bash
npm install @pir0zh0k/nuxt-modals
# или
pnpm add @pir0zh0k/nuxt-modals
# или
yarn add @pir0zh0k/nuxt-modals
```

Добавьте модуль в `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@pir0zh0k/nuxt-modals']
})
```

## 🚀 Быстрый старт

### 1. Создайте варианты оберток модальных окон

Создайте компоненты-обертки, которые будут определять внешний вид модального окна (широкое, узкое, полноэкранное и т.д.):

```vue
<!-- components/modals/BaseModal.vue -->
<script lang="ts" setup>
import type { Component } from 'vue'

interface Props {
  innerComponent: Component | null
  props?: object
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <button class="modal-close" @click="emit('close')">×</button>
      <component :is="innerComponent" v-if="innerComponent" v-bind="props?.props" />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
```

### 2. Создайте конфигурацию модальных окон

Создайте файл с конфигурацией (например, `composables/modals.ts`):

```ts
import { createModalVariants, createModalConfig } from '@pir0zh0k/nuxt-modals/types'
import BaseModal from '~/components/modals/BaseModal.vue'
import AuthModal from '~/components/modals/AuthModal.vue'
import RegisterModal from '~/components/modals/RegisterModal.vue'

// Определяем варианты оберток
export const modalVariants = createModalVariants([
  {
    key: 'base',
    component: BaseModal,
  },
])

// Определяем конкретные модальные окна
export const modalConfig = createModalConfig(modalVariants, {
  auth: {
    variant: 'base',
    component: AuthModal,
  },
  register: {
    variant: 'base',
    component: RegisterModal,
  },
})
```

### 3. Инициализируйте конфигурацию

В вашем главном layout или компоненте (например, `app.vue` или `layouts/default.vue`):

```vue
<script lang="ts" setup>
import { modalConfig, modalVariants } from '~/composables/modals'

// Инициализация должна произойти один раз при загрузке приложения
useInitModalConfig(modalConfig, modalVariants)

const { open, close } = useModal()
</script>

<template>
  <div>
    <!-- Ваш контент -->
    <button @click="open({ key: 'auth' })">Войти</button>
    <button @click="open({ key: 'register' })">Регистрация</button>
    
    <!-- Обязательно добавьте ModalContainer -->
    <ModalContainer />
  </div>
</template>
```

### 4. Используйте модальные окна

Теперь вы можете открывать модальные окна из любого места в вашем приложении:

```vue
<script lang="ts" setup>
const { open, close, openedModal } = useModal()

const handleAuth = () => {
  open({ key: 'auth' })
}

const handleRegister = () => {
  open({ key: 'register', props: { initialEmail: 'user@example.com' } })
}
</script>

<template>
  <div>
    <button @click="handleAuth">Войти</button>
    <button @click="handleRegister">Регистрация</button>
    
    <!-- Проверка открытого модального окна -->
    <p v-if="openedModal">Открыто: {{ openedModal.key }}</p>
  </div>
</template>
```

## 📚 API

### Композаблы

#### `useInitModalConfig(config, variants)`

Инициализирует конфигурацию модальных окон. Реализует паттерн Singletone - инициализация происходит только один раз.

**Параметры:**
- `config` - Конфигурация модальных окон (объект, где ключи - это идентификаторы модальных окон)
- `variants` - Массив вариантов оберток модальных окон

**Возвращает:** Инициализированную конфигурацию

**Пример:**
```ts
const config = useInitModalConfig(modalConfig, modalVariants)
```

#### `useModal()`

Основной композабл для управления модальными окнами.

**Возвращает:**
- `open(payload, onOpen?)` - Функция для открытия модального окна
  - `payload.key` - Ключ модального окна из конфигурации
  - `payload.props` - Опциональные свойства для передачи в модальное окно
  - `onOpen` - Опциональный callback, который вызывается после успешного открытия модального окна
- `close(onClose?)` - Функция для закрытия текущего открытого модального окна
  - `onClose` - Опциональный callback, который вызывается после закрытия модального окна
- `openedModal` - Реактивная ссылка на текущее открытое модальное окно или `null`

**Пример:**
```ts
const { open, close, openedModal } = useModal()

// Открыть модальное окно без свойств
open({ key: 'auth' })

// Открыть модальное окно со свойствами
open({ 
  key: 'register', 
  props: { email: 'user@example.com' } 
})

// Открыть модальное окно с callback
open({ key: 'auth' }, () => {
  console.log('Модальное окно открыто!')
})

// Закрыть модальное окно
close()

// Закрыть модальное окно с callback
close(() => {
  console.log('Модальное окно закрыто!')
})

// Проверить текущее состояние
if (openedModal.value) {
  console.log('Открыто:', openedModal.value.key)
}
```

### Компоненты

#### `<ModalContainer />`

Автоматически зарегистрированный глобальный компонент, который отвечает за отображение модальных окон. Должен быть добавлен в ваш layout или главный компонент приложения.

**Важно:** Этот компонент должен присутствовать в вашем приложении, иначе модальные окна не будут отображаться.

**Пример:**
```vue
<template>
  <div>
    <!-- Ваш контент -->
    <ModalContainer />
  </div>
</template>
```

### Helper функции

#### `createModalVariants(variants)`

Создает типизированный массив вариантов оберток модальных окон. Помогает TypeScript вывести конкретные типы ключей.

**Параметры:**
- `variants` - Массив вариантов оберток с ключом и компонентом

**Возвращает:** Типизированный массив вариантов

**Пример:**
```ts
const variants = createModalVariants([
  { key: 'base', component: BaseModal },
  { key: 'slim', component: SlimModal },
])
```

#### `createModalConfig(variants, config)`

Создает типизированную конфигурацию модальных окон. Помогает TypeScript вывести конкретные типы ключей и обеспечить соответствие вариантам.

**Параметры:**
- `variants` - Массив вариантов оберток (результат `createModalVariants`)
- `config` - Конфигурация модальных окон (объект с ключами модальных окон)

**Возвращает:** Типизированную конфигурацию модальных окон

**Пример:**
```ts
const config = createModalConfig(variants, {
  auth: {
    variant: 'base', // Должен соответствовать ключу из variants
    component: AuthModal,
  },
})
```

## 🎯 Типизация

Модуль полностью типизирован и использует TypeScript для обеспечения типобезопасности.

### Типы модальных окон

```ts
import type { 
  IModalVariant,
  IModalConfig,
  IModalConfigItem,
  IOpenedModal,
  IUseModalPayload 
} from '@pir0zh0k/nuxt-modals/types'
```

### Типизация с передачей свойств

Если вы передаете свойства в модальное окно, вы можете типизировать их:

```ts
// В компоненте модального окна
<script lang="ts" setup>
interface Props {
  email?: string
  title?: string
}

defineProps<Props>()
</script>

// При открытии модального окна
open({
  key: 'auth',
  props: {
    email: 'user@example.com',
    title: 'Вход в систему'
  } as Props
})
```

## 🔍 Нюансы и особенности

### 1. Паттерн Singletone

`useInitModalConfig` использует паттерн Singletone - это значит, что повторный вызов с другими параметрами не приведет к переинициализации. Конфигурация инициализируется только один раз при первом вызове.

**Рекомендация:** Вызывайте `useInitModalConfig` один раз в корневом компоненте или layout, а не в каждом компоненте.

### 2. Структура компонента-обертки

Компонент-обертка (variant) должен принимать следующие props:
- `innerComponent: Component | null` - Внутренний компонент модального окна
- `props?: object` - Свойства для передачи во внутренний компонент

И должен emit событие:
- `close: []` - Событие закрытия модального окна

**Пример правильной обертки:**
```vue
<script lang="ts" setup>
import type { Component } from 'vue'

interface Props {
  innerComponent: Component | null
  props?: object
}

defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <component :is="innerComponent" v-if="innerComponent" v-bind="props?.props" />
    </div>
  </div>
</template>
```

### 3. SSR совместимость

Модуль полностью совместим с SSR. Компонент `ModalContainer` автоматически рендерится только на клиенте, что предотвращает проблемы с гидратацией.

### 4. Обязательное наличие ModalContainer

Компонент `<ModalContainer />` должен быть добавлен в ваше приложение, иначе модальные окна не будут отображаться. Рекомендуется добавлять его в корневой layout или в `app.vue`.

### 5. Проверка инициализации

Перед использованием `useModal` убедитесь, что конфигурация инициализирована. Если конфигурация не инициализирована, вызов `open()` не приведет к ошибке, но модальное окно не откроется.

### 6. Типобезопасность ключей

Использование `createModalVariants` и `createModalConfig` обеспечивает типобезопасность. TypeScript будет предупреждать, если:
- Используется несуществующий ключ варианта в конфигурации
- Используется несуществующий ключ модального окна при вызове `open()`

## 📖 Примеры использования

### Модальное окно с формой авторизации

```vue
<!-- components/modals/AuthModal.vue -->
<script lang="ts" setup>
interface Props {
  initialEmail?: string
}

const props = defineProps<Props>()
const { close } = useModal()

const email = ref(props.initialEmail || '')
const password = ref('')

const handleSubmit = async () => {
  // Логика авторизации
  await auth.login(email.value, password.value)
  close(() => {
    // Callback после закрытия - можно выполнить редирект или обновление данных
    router.push('/dashboard')
  })
}
</script>

<template>
  <div class="auth-modal">
    <h2>Вход в систему</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Пароль" />
      <button type="submit">Войти</button>
    </form>
  </div>
</template>
```

### Открытие модального окна с параметрами

```vue
<script lang="ts" setup>
const { open } = useModal()

const showAuthModal = () => {
  open({
    key: 'auth',
    props: {
      initialEmail: 'user@example.com'
    }
  })
}
</script>

<template>
  <button @click="showAuthModal">Войти с email</button>
</template>
```

### Множественные варианты оберток

```ts
// composables/modals.ts
export const modalVariants = createModalVariants([
  {
    key: 'base',
    component: BaseModal, // Широкое модальное окно
  },
  {
    key: 'slim',
    component: SlimModal, // Узкое модальное окно
  },
  {
    key: 'fullscreen',
    component: FullscreenModal, // Полноэкранное модальное окно
  },
])

export const modalConfig = createModalConfig(modalVariants, {
  auth: {
    variant: 'base', // Использует широкое модальное окно
    component: AuthModal,
  },
  quickLogin: {
    variant: 'slim', // Использует узкое модальное окно
    component: QuickLoginModal,
  },
  settings: {
    variant: 'fullscreen', // Использует полноэкранное модальное окно
    component: SettingsModal,
  },
})
```

### Программное закрытие модального окна

```vue
<script lang="ts" setup>
const { close, openedModal } = useModal()

// Закрыть при нажатии Escape с callback
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && openedModal.value) {
      close(() => {
        console.log('Модальное окно закрыто по Escape')
      })
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
```

## 🛠 Разработка

Для локальной разработки модуля:

```bash
# Установить зависимости
npm install

# Сгенерировать типы
npm run dev:prepare

# Запустить playground
npm run dev

# Собрать playground
npm run dev:build

# Запустить линтер
npm run lint
npm run lint:fix

# Запустить тесты
npm run test
```

## 📝 Лицензия

MIT

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@pir0zh0k/nuxt-modals/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@pir0zh0k/nuxt-modals
[npm-downloads-src]: https://img.shields.io/npm/dm/@pir0zh0k/nuxt-modals.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@pir0zh0k/nuxt-modals
[license-src]: https://img.shields.io/npm/l/@pir0zh0k/nuxt-modals.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@pir0zh0k/nuxt-modals
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
