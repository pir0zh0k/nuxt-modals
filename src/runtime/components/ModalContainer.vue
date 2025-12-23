<script lang="ts" setup>
import { computed } from 'vue'
import {
  getModalComponent,
  getModalInnerComponent,
} from '../lib/useInitModalConfig'
import { useModal } from '../lib/useModal'

const { openedModal, close } = useModal()

const wrapperComponent = computed(() => {
  if (!openedModal.value) {
    return null
  }
  return getModalComponent(openedModal.value.key)
})

const innerComponent = computed(() => {
  if (!openedModal.value) {
    return null
  }
  return getModalInnerComponent(openedModal.value.key)
})
</script>

<template>
  <component
    :is="wrapperComponent"
    v-if="wrapperComponent && openedModal"
    :inner-component="innerComponent"
    :props="openedModal.props"
    @close="close"
  />
</template>
