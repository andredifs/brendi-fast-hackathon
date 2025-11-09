<script setup lang="ts">
import type { Period, Range } from '~/types'

interface MenuEvent {
  id: string;
  created_at: any;
  event_type: string;
  device_type: string;
  platform: string;
  metadata?: any;
  created_at_formatted?: string;
}

const props = defineProps<{
  events: MenuEvent[]
  period: Period
  range: Range
}>()

const eventTypeLabels: Record<string, string> = {
  pageView: 'Visualização de Página',
  productView: 'Visualização de Produto',
  addToCart: 'Adicionar ao Carrinho',
  checkoutStart: 'Início do Checkout',
  purchase: 'Compra'
}

const eventTypeColors: Record<string, string> = {
  pageView: 'gray',
  productView: 'blue',
  addToCart: 'amber',
  checkoutStart: 'orange',
  purchase: 'green'
}

// Get last 50 events
const displayEvents = computed(() => {
  return (props.events || []).slice(0, 50).map(event => ({
    ...event,
    // Formata a data se vier como timestamp
    created_at_formatted: event.created_at?._seconds
      ? new Date(event.created_at._seconds * 1000).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : event.created_at
  }))
})

const columns = [
  {
    id: 'event_type',
    key: 'event_type',
    label: 'Tipo de Evento',
    sortable: false
  },
  {
    id: 'device_type',
    key: 'device_type',
    label: 'Dispositivo',
    sortable: false
  },
  {
    id: 'platform',
    key: 'platform',
    label: 'Plataforma',
    sortable: false
  },
  {
    id: 'created_at',
    key: 'created_at',
    label: 'Data',
    sortable: false
  }
]
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
      :rows="displayEvents"
    >
      <template #event_type-data="{ row }">
        <UBadge
          :color="(eventTypeColors[(row as any).event_type] as any) || 'gray'"
          variant="subtle"
        >
          {{ eventTypeLabels[(row as any).event_type] || (row as any).event_type }}
        </UBadge>
      </template>

      <template #device_type-data="{ row }">
        <span class="capitalize">{{ (row as any).device_type }}</span>
      </template>

      <template #platform-data="{ row }">
        <span class="capitalize">{{ (row as any).platform }}</span>
      </template>

      <template #created_at-data="{ row }">
        <span class="text-sm text-muted">{{ (row as any).created_at_formatted || (row as any).created_at }}</span>
      </template>
    </UTable>
  </UCard>
</template>

