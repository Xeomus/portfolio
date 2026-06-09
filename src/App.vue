<script setup>
import AboutSection from '@/components/portfolio/AboutSection.vue'
import ActivitySection from '@/components/portfolio/ActivitySection.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
import ExperienceSection from '@/components/portfolio/ExperienceSection.vue'
import HeroSection from '@/components/portfolio/HeroSection.vue'
import ProjectsSection from '@/components/portfolio/ProjectsSection.vue'
import SignalStrip from '@/components/portfolio/SignalStrip.vue'
import SiteFooter from '@/components/portfolio/SiteFooter.vue'
import TechSection from '@/components/portfolio/TechSection.vue'
import TopBar from '@/components/portfolio/TopBar.vue'
import { useGitHubProfile } from '@/composables/useGitHubProfile'
import { experiences } from '@/data/portfolio'

const {
  displayContributionWeeks,
  displayProjects,
  displayStats,
  displayTechnologies,
  isLoading,
  totalContributions,
} = useGitHubProfile()
</script>

<template>
  <div class="site-shell">
      <TopBar />

    <main>
      <HeroSection />
      <SignalStrip :stats="displayStats" />
      <AboutSection />
      <ActivitySection
        :contribution-weeks="displayContributionWeeks"
        :total-contributions="totalContributions"
      />
      <ExperienceSection :experiences="experiences" />
      <ProjectsSection :is-loading="isLoading" :projects="displayProjects" />
      <TechSection :technologies="displayTechnologies" />
      <ContactSection />
    </main>

    <SiteFooter />
  </div>
</template>
