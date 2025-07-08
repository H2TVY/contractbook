<script setup>
defineProps({
  contacts: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
});

const $emit = defineEmits(['update:selectedIndex']);
</script>

<template>
  <ul class="list-group">
    <li
      class="list-group-item px-3"
      v-for="(contact, index) in contacts"
      :key="contact.id"
      :class="{ active: index === selectedIndex }"
      @click="$emit('update:selectedIndex', index)"
    >
      {{ contact.name }}
    </li>
  </ul>
</template>
