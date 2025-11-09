<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const restaurant = {
  label: 'Bambinella Pizzaria',
  avatar: {
    src: 'https://firebasestorage.googleapis.com/v0/b/brendi-app.appspot.com/o/public%2Fstores%2F0WcZ1MWEaFc1VftEBdLa%2Fimages%2Flogos%2F0WcZ1MWEaFc1VftEBdLa.jpeg?alt=media&token=59b3e0bd-f8b7-4bad-a158-06092b0c12aa',
    alt: 'Bambinella Pizzaria'
  }
}
</script>

<template>
  <UButton
    v-bind="{
      ...restaurant,
      label: collapsed ? undefined : restaurant?.label
    }"
    color="neutral"
    variant="ghost"
    block
    :square="collapsed"
    :class="[!collapsed && 'py-2']"
    disabled
  />
</template>
