<script setup lang="ts">
const { isNotificationsSlideoverOpen } = useDashboard()
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    title="Notificações"
  >
    <template #body>
      <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <UIcon
          name="i-lucide-bell-off"
          class="size-12 text-muted mb-4"
        />
        <p class="text-sm text-muted">
          Nenhuma notificação disponível
        </p>
      </div>
    </template>
  </USlideover>
</template>
