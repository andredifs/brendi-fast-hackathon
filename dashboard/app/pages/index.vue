<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

// State
const events = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Buscar eventos no mount
onMounted(async () => {
  try {
    loading.value = true
    const url = '/api/events?storeId=0WcZ1MWEaFc1VftEBdLa'
    const data = await $fetch(url)
    events.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    error.value = e.message || 'Erro desconhecido'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Análise de Cardápio"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip
            text="Notifications"
            :shortcuts="['N']"
          >
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip
                color="error"
                inset
              >
                <UIcon
                  name="i-lucide-bell"
                  class="size-5 shrink-0"
                />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker
            v-model="range"
            class="-ms-1"
          />

          <HomePeriodSelect
            v-model="period"
            :range="range"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6 space-y-6">
        <!-- Stats -->
        <HomeMenuEventsStats
          v-if="events.length > 0"
          :events="events"
          :period="period"
          :range="range"
        />

        <!-- Table -->
        <HomeMenuEventsTable
          v-if="events.length > 0"
          :events="events"
          :period="period"
          :range="range"
        />

        <!-- Empty State -->
        <UCard v-else-if="!loading && events.length === 0">
          <div class="text-center py-12">
            <UIcon name="i-lucide-inbox" class="size-12 text-gray-400 mb-4" />
            <p class="text-gray-500">Nenhum evento encontrado</p>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
