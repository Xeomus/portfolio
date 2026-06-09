<script setup>
import GitHubCalendar from './GitHubCalendar.vue'
import '@/assets/css/activity-section.css'

defineProps({
  contributionWeeks: {
    type: Array,
    required: true,
  },
  totalContributions: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <section class="section-wrap activity" aria-labelledby="activity-title">
    <div class="activity-head">
      <div>
        <p class="eyebrow">GitHub Activity</p>
        <h2 id="activity-title">{{ totalContributions.toLocaleString() }} contributions in the last year</h2>
      </div>
      <span class="activity-note">Check my GitHub contributions</span>
    </div>
    <GitHubCalendar :weeks="contributionWeeks" />
  </section>
</template>
