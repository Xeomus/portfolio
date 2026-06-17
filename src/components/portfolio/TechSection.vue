<script setup>
import { getDevicon, useDeviconFallback } from '@/utils/devicon'
import '@/assets/css/tech-section.css'

defineProps({
  technologies: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section id="tecnologias" class="section-wrap tech-section" aria-labelledby="tech-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Technologies I use.</p>
        <h2 id="tech-title">Tech Stack</h2>
      </div>
      <p>Modern tools for designing, building, and deploying complete products.</p>
    </div>
    <div class="tech-categories">
      <article v-for="group in technologies" :key="group.category" class="tech-category">
        <h3>{{ group.category }}</h3>
        <div class="tech-cloud">
          <a v-for="tech in group.items" :key="tech" href="#contacto">
            <img
              v-if="getDevicon(tech).src"
              :src="getDevicon(tech).src"
              :alt="getDevicon(tech).alt"
              @error="useDeviconFallback($event, tech)"
            />
            <span>{{ tech }}</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
