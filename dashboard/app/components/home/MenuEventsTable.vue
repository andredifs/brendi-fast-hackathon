<script setup lang="ts">
import { eventsApi } from '~/utils/api-client'
import type { Period, Range } from '~/types'

interface MenuEvent {
  id: string;
  created_at: string;
  event_type: string;
  device_type: string;
  platform: string;
  metadata: string;
}

const props = defineProps<{
  period: Period
  range: Range
}>()

const eventTypeLabels: Record<string, string> = {
  pageView: 'Visualização de Página',
  productView: 'Visualização de Produto',
  addToCart: 'Adicionar ao Carrinho',
  checkoutStart: 'Início do Checkout',
  purchase: 'Compra'
};

const eventTypeColors: Record<string, string> = {
  pageView: 'gray',
  productView: 'blue',
  addToCart: 'amber',
  checkoutStart: 'orange',
  purchase: 'green'
};

const { data: events, pending } = await useAsyncData<MenuEvent[]>('menu-events-table', async () => {
  try {
    const allEvents = await eventsApi.list({
      storeId: '0WcZ1MWEaFc1VftEBdLa'
    }) as MenuEvent[];

    // Return only the last 50 events
    return allEvents.slice(0, 50);
  } catch (error) {
    console.error('Error fetching menu events:', error);
    return [];
  }
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})

const columns = [{
  key: 'event_type',
  label: 'Tipo de Evento'
}, {
  key: 'device_type',
  label: 'Dispositivo'
}, {
  key: 'platform',
  label: 'Plataforma'
}, {
  key: 'created_at',
  label: 'Data'
}];
</script>

<template>
  <UCard
    :ui="{ body: '!p-0' }"
  >
    <template #header>
      <div>
        <p class="text-sm font-semibold">
          Eventos Recentes do Cardápio
        </p>
        <p class="text-xs text-muted">
          Últimos 50 eventos registrados
        </p>
      </div>
    </template>

    <UTable
      :columns="columns"
      :rows="events"
      :loading="pending"
    >
      <template #event_type-data="{ row }">
        <UBadge
          :color="eventTypeColors[row.event_type] || 'gray'"
          variant="subtle"
        >
          {{ eventTypeLabels[row.event_type] || row.event_type }}
        </UBadge>
      </template>

      <template #device_type-data="{ row }">
        <span class="capitalize">{{ row.device_type }}</span>
      </template>

      <template #platform-data="{ row }">
        <span class="capitalize">{{ row.platform }}</span>
      </template>

      <template #created_at-data="{ row }">
        <span class="text-sm text-muted">{{ row.created_at }}</span>
      </template>
    </UTable>
  </UCard>
</template>

