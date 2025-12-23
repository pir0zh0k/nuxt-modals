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
  <div class="modal-wrapper">
    <div class="modal">
      <button @click="emit('close')">Close</button>
      <component :is="innerComponent" v-if="innerComponent" v-bind="props" />
    </div>
  </div>
</template>

<style scoped>
.modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.489);
}

.modal {
  width: 200px;
  height: 500px;
  background: blue;
}
</style>
