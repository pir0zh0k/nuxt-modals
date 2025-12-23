<script lang="ts" setup>
import { modalConfig, modalVariants } from './config'

useInitModalConfig(modalConfig, modalVariants)

const { open } = useModal()
</script>

<template>
  <div>
    <button @click="open({ key: 'auth' }, () => console.log('Open'))">
      open
    </button>

    <button @click="open({ key: 'register' })">open slim modal</button>
  </div>

  <ModalContainer />
</template>
