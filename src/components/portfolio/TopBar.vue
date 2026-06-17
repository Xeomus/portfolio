<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '@/assets/css/topbar.css'

const navItems = [
  { href: '#inicio', id: 'inicio', label: 'Home' },
  { href: '#experiencia', id: 'experiencia', label: 'Experience' },
  { href: '#trabajo', id: 'trabajo', label: 'My work' },
  { href: '#contacto', id: 'contacto', label: 'Contact' },
]

const observedSections = [
  { id: 'inicio', navId: 'inicio' },
  { id: 'acerca', navId: 'inicio' },
  { id: 'actividad', navId: 'inicio' },
  { id: 'experiencia', navId: 'experiencia' },
  { id: 'trabajo', navId: 'trabajo' },
  { id: 'tecnologias', navId: 'trabajo' },
  { id: 'contacto', navId: 'contacto' },
]

const activeSection = ref('inicio')
let scrollFrame

function setActiveSection(sectionId) {
  activeSection.value = sectionId
}

function updateActiveSection() {
  const activationLine = window.innerHeight * 0.36
  const currentSection = observedSections
    .map((section) => ({
      ...section,
      element: document.getElementById(section.id),
    }))
    .filter((section) => section.element)
    .map((section) => ({
      ...section,
      top: section.element.getBoundingClientRect().top,
    }))
    .filter((section) => section.top <= activationLine)
    .sort((first, second) => second.top - first.top)[0]

  if (currentSection) {
    activeSection.value = currentSection.navId
  }
}

function requestActiveSectionUpdate() {
  if (scrollFrame) return

  scrollFrame = window.requestAnimationFrame(() => {
    updateActiveSection()
    scrollFrame = null
  })
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', requestActiveSectionUpdate, { passive: true })
  window.addEventListener('resize', requestActiveSectionUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestActiveSectionUpdate)
  window.removeEventListener('resize', requestActiveSectionUpdate)

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
  }
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
