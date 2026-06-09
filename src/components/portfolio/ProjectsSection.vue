<script setup>
import Skeleton from 'primevue/skeleton'
import { getDevicon, useDeviconFallback } from '@/utils/devicon'
import '@/assets/css/projects-section.css'

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  projects: {
    type: Array,
    required: true,
  },
})

function useProjectImageFallback(event, fallbackImage) {
  if (!fallbackImage || event.target.src === fallbackImage) return

  event.target.src = fallbackImage
}
</script>

<template>
  <section id="trabajo" class="section-wrap projects" aria-labelledby="projects-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Featured Projects.</p>
        <h2 id="projects-title">Portfolio Projects</h2>
      </div>
      <p>Personal projects showcasing my skills and experience.</p>
    </div>

    <template v-if="isLoading">
      <article v-for="index in 3" :key="index" class="project-card project-card-skeleton">
        <div class="project-image">
          <div class="browser-bar">
            <span></span>
            <span></span>
            <span></span>
            <Skeleton width="35%" height="0.8rem" borderRadius="999px" />
          </div>
          <Skeleton width="100%" height="340px" borderRadius="0 0 12px 12px" />
        </div>
        <div class="project-content">
          <Skeleton width="4.5rem" height="1.6rem" borderRadius="999px" />
          <Skeleton width="75%" height="2.4rem" borderRadius="8px" />
          <Skeleton width="42%" height="1rem" borderRadius="8px" />
          <Skeleton width="100%" height="1rem" borderRadius="8px" />
          <Skeleton width="92%" height="1rem" borderRadius="8px" />
          <Skeleton width="68%" height="1rem" borderRadius="8px" />
          <div class="project-skeleton-stack">
            <Skeleton v-for="chip in 5" :key="chip" width="5.6rem" height="2rem" borderRadius="8px" />
          </div>
        </div>
      </article>
    </template>

    <p v-else-if="!projects.length" class="projects-empty">
      GitHub projects are unavailable right now.
    </p>

    <article v-for="project in projects" v-else :key="project.title" class="project-card">
      <div class="project-image">
        <div class="browser-bar">
          <span></span>
          <span></span>
          <span></span>
          <small>{{ project.domain }}</small>
        </div>
        <img
          :src="project.image"
          :alt="`Captura de ${project.title}`"
          @error="useProjectImageFallback($event, project.imageFallback)"
        />
      </div>
      <div class="project-content">
        <span class="project-type">{{ project.type }}</span>
        <h3>{{ project.title }}</h3>
        <time>{{ project.date }}</time>
        <p>{{ project.description }}</p>
        <a v-if="project.url" class="read-more" :href="project.url" target="_blank" rel="noreferrer">
          View Project →
        </a>
        <button v-else type="button" class="read-more">Read more →</button>
        <h4>Technologies</h4>
        <div class="tech-list">
          <span v-for="tech in project.technologies" :key="tech">
            <img v-if="getDevicon(tech).src" :src="getDevicon(tech).src" :alt="getDevicon(tech).alt"
              @error="useDeviconFallback($event, tech)" />
            {{ tech }}
          </span>
        </div>
      </div>
    </article>
  </section>
</template>
