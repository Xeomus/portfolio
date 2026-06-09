<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '@/assets/css/topbar.css'

const navItems = [
  { href: '#inicio', id: 'inicio', label: 'Home' },
  { href: '#trabajo', id: 'trabajo', label: 'My work' },
  { href: '#experiencia', id: 'experiencia', label: 'Experience' },
  { href: '#contacto', id: 'contacto', label: 'Contact' },
]

const activeSection = ref('inicio')
let observer

function setActiveSection(sectionId) {
  activeSection.value = sectionId
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]

      if (visibleEntry) {
        activeSection.value = visibleEntry.target.id
      }
    },
    {
      rootMargin: '-28% 0px -58% 0px',
      threshold: [0.1, 0.25, 0.5],
    },
  )

  navItems.forEach((item) => {
    const section = document.getElementById(item.id)

    if (section) {
      observer.observe(section)
    }
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <header class="topbar">
    <a class="brand" href="#inicio" aria-label="Ir al inicio">
      <img src="/favicon.ico" alt="NV" class="brand-icon" />
    </a>
    <nav aria-label="Principal">
      <a v-for="item in navItems" :key="item.id" :href="item.href" :class="{ active: activeSection === item.id }"
        @click="setActiveSection(item.id)">
        {{ item.label }}
      </a>
    </nav>
    <a class="topbar-action" href="/EstebanNava_Dev_en.pdf" download="EstebanNava_Dev_en.pdf">
      <i class="bi bi-download btn-icon" aria-hidden="true"></i>
      Download CV
    </a>
  </header>
</template>
