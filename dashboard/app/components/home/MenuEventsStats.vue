<script setup lang="ts">
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
  events: MenuEvent[]
  period: Period
  range: Range
}>()

// Calculate stats from events
const stats = computed(() => {
  const events = props.events || []
  
  const pageViews = events.filter(e => e.event_type === 'pageView').length
  const productViews = events.filter(e => e.event_type === 'productView').length
  const addToCarts = events.filter(e => e.event_type === 'addToCart').length
  const purchases = events.filter(e => e.event_type === 'purchase').length

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
  ]
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
  </UPageGrid>
</template>

