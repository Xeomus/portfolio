import { computed, onMounted, ref } from 'vue'
import {
  contributionWeeks,
  githubUsername,
  stats,
  technologies,
} from '@/data/portfolio'

const numberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function formatNumber(value) {
  return numberFormatter.format(value)
}

export function useGitHubProfile() {
  const profile = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const displayStats = computed(() => {
    if (!profile.value) return stats

    return [
      { value: formatNumber(profile.value.totalStars), label: 'stars' },
      { value: formatNumber(profile.value.totalContributions), label: 'contributions' },
      { value: formatNumber(profile.value.publicRepos), label: 'repositorios' },
      { value: formatNumber(profile.value.followers), label: 'Github followers' },
    ]
  })

  const displayProjects = computed(() => profile.value?.projects ?? [])

  const displayContributionWeeks = computed(
    () => profile.value?.contributionWeeks?.length ? profile.value.contributionWeeks : contributionWeeks,
  )

  const displayTechnologies = computed(() => technologies)

  const totalContributions = computed(
    () => profile.value?.totalContributions ?? 2584,
  )

  onMounted(async () => {
    try {
      const response = await fetch(`/api/github?username=${githubUsername}`)

      if (!response.ok) {
        throw new Error(`GitHub API response ${response.status}`)
      }

      profile.value = await response.json()
    } catch (requestError) {
      error.value = requestError
    } finally {
      isLoading.value = false
    }
  })

  return {
    displayContributionWeeks,
    displayProjects,
    displayStats,
    displayTechnologies,
    error,
    isLoading,
    totalContributions,
  }
}
