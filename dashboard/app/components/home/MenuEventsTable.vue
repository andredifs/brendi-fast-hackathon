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
    accessorKey: 'event_type',
    header: 'Tipo de Evento',
    cell: ({ row }: any) => {
      const type = row.original.event_type
      return eventTypeLabels[type] || type
    }
  },
  {
    accessorKey: 'device_type',
    header: 'Dispositivo',
    cell: ({ row }: any) => row.original.device_type
  },
  {
    accessorKey: 'platform',
    header: 'Plataforma',
    cell: ({ row }: any) => row.original.platform
  },
  {
    accessorKey: 'created_at',
    header: 'Data',
    cell: ({ row }: any) => {
      return row.original.created_at_formatted || String(row.original.created_at || '')
    }
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
      :data="displayEvents"
      :columns="columns"
    >
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-12 gap-3">
          <span class="text-sm text-gray-500">Nenhum evento encontrado</span>
        </div>
      </template>
    </UTable>
  </UCard>
</template>

