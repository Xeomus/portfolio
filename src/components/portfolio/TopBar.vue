<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import '@/assets/css/topbar.css'

const navItems = [
  { href: '#inicio', icon: 'bi-house-fill', id: 'inicio', label: 'Home' },
  { href: '#experiencia', icon: 'bi-briefcase-fill', id: 'experiencia', label: 'Experience' },
  { href: '#trabajo', icon: 'bi-grid-1x2-fill', id: 'trabajo', label: 'My work' },
  { href: '#contacto', icon: 'bi-envelope-fill', id: 'contacto', label: 'Contact' },
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
const menuOpen = ref(false)
const theme = ref('dark')
const themeIcon = computed(() => theme.value === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill')
const themeLabel = computed(() => theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
const menuLabel = computed(() => menuOpen.value ? 'Close navigation menu' : 'Open navigation menu')
let scrollFrame

function setActiveSection(sectionId) {
  activeSection.value = sectionId
  menuOpen.value = false
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

function applyTheme(nextTheme) {
  theme.value = nextTheme
  document.documentElement.dataset.theme = nextTheme
  localStorage.setItem('theme', nextTheme)
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

onMounted(() => {
  const storedTheme = localStorage.getItem('theme')
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches

  applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'))
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
  <header class="topbar" :class="{ 'is-menu-open': menuOpen }">
    <a class="brand" href="#inicio" aria-label="Ir al inicio">
      <img src="/favicon.ico" alt="NV" class="brand-icon" />
    </a>
    <nav id="mobile-nav-menu" aria-label="Principal">
      <a v-for="item in navItems" :key="item.id" :href="item.href" :class="{ active: activeSection === item.id }"
        :aria-label="item.label" @click="setActiveSection(item.id)">
        <i class="bi" :class="item.icon" aria-hidden="true"></i>
        <span class="nav-label">{{ item.label }}</span>
      </a>
    </nav>
    <div class="topbar-actions">
      <button class="theme-toggle" type="button" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
        <i class="bi" :class="themeIcon" aria-hidden="true"></i>
      </button>
      <a class="topbar-action" href="/EstebanNava_Dev_en.pdf" download="EstebanNava_Dev_en.pdf">
        <i class="bi bi-download btn-icon" aria-hidden="true"></i>
        Download CV
      </a>
    </div>
    <button
      class="mobile-menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="mobile-nav-menu"
      :aria-label="menuLabel"
      @click="toggleMenu"
    >
      <i class="bi" :class="menuOpen ? 'bi-x-lg' : 'bi-list'" aria-hidden="true"></i>
    </button>
  </header>
</template>
