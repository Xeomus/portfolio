<script setup>
import { getDevicon, useDeviconFallback } from '@/utils/devicon'
import '@/assets/css/experience-section.css'

defineProps({
  experiences: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section id="experiencia" class="section-wrap experience" aria-labelledby="experience-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Experience.</p>
        <h2 id="experience-title">Career path</h2>
      </div>
      <p>From intuitive user interfaces to scalable backend systems, I enjoy transforming ideas into reliable products
        that deliver real value.</p>
    </div>

    <div class="timeline">
      <article v-for="item in experiences" :key="item.title" class="experience-card">
        <div class="timeline-mark">{{ item.mark }}</div>
        <div class="experience-panel">
          <div class="experience-top">
            <div>
              <h3>{{ item.title }} <span>{{ item.badge }}</span></h3>
              <p>{{ item.company }} / {{ item.location }}</p>
            </div>
            <time>{{ item.date }}</time>
          </div>
          <p class="experience-summary">{{ item.summary }}</p>
          <ul>
            <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
          <div class="tech-list">
            <span v-for="tech in item.stack" :key="tech">
              <img
                v-if="getDevicon(tech).src"
                :src="getDevicon(tech).src"
                :alt="getDevicon(tech).alt"
                @error="useDeviconFallback($event, tech)"
              />
              {{ tech }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
