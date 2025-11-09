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

interface EventStats {
  title: string;
  icon: string;
  value: number | string;
}

const props = defineProps<{
  period: Period
  range: Range
}>()

const { data: stats, pending } = await useAsyncData<EventStats[]>('menu-events-stats', async () => {
  try {
    // For now, we'll fetch all events without date filtering
    const events = await eventsApi.list({
      storeId: '0WcZ1MWEaFc1VftEBdLa'
    }) as MenuEvent[];

    // Calculate stats
    const pageViews = events.filter(e => e.event_type === 'pageView').length;
    const productViews = events.filter(e => e.event_type === 'productView').length;
    const addToCarts = events.filter(e => e.event_type === 'addToCart').length;
    const purchases = events.filter(e => e.event_type === 'purchase').length;

    return [
      {
        title: 'Visualizações',
        icon: 'i-lucide-eye',
        value: pageViews
      },
      {
        title: 'Produtos Vistos',
        icon: 'i-lucide-search',
        value: productViews
      },
      {
        title: 'Adicionados ao Carrinho',
        icon: 'i-lucide-shopping-cart',
        value: addToCarts
      },
      {
        title: 'Compras',
        icon: 'i-lucide-check-circle',
        value: purchases
      }
    ];
  } catch (error) {
    console.error('Error fetching menu events stats:', error);
    return [];
  }
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>
      </div>
    </UPageCard>
    
    <div v-if="pending" class="col-span-4 text-center py-4">
      <USkeleton class="h-20 w-full" />
    </div>
  </UPageGrid>
</template>

