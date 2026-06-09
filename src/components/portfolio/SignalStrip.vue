<script setup>
import '@/assets/css/signal-strip.css'

defineProps({
  stats: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="section-wrap signal-strip" aria-label="Metricas">
    <span v-for="stat in stats" :key="stat.label">
      <strong>{{ stat.value }}</strong> {{ stat.label }}
    </span>
  </section>
</template>
