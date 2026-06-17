const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const githubPortfolioQuery = `
  query PortfolioProfile($username: String!, $repositoriesAfter: String) {
    user(login: $username) {
      followers {
        totalCount
      }
      repositories(
        first: 100
        after: $repositoriesAfter
        ownerAffiliations: OWNER
        privacy: PUBLIC
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          isArchived
          isFork
          pushedAt
          primaryLanguage {
            name
            color
          }
          languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              name
            }
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`

const technologyAliases = {
  angularjs: 'Angular',
  aws: 'AWS',
  'asp-classic': 'ASP Classic',
  bootstrap: 'Bootstrap',
  'c#': 'C#',
  'c-sharp': 'C#',
  csharp: 'C#',
  css: 'CSS',
  css3: 'CSS',
  'dot-net': '.NET',
  dotnet: '.NET',
  'express-js': 'Express',
  expressjs: 'Express',
  github: 'GitHub',
  html: 'HTML',
  html5: 'HTML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  mongodb: 'MongoDB',
  mysql: 'MySQL',
  node: 'Node.js',
  'node-js': 'Node.js',
  'node.js': 'Node.js',
  nodejs: 'Node.js',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  'react-js': 'React',
  reactjs: 'React',
  sql: 'SQL',
  'spring-boot': 'Spring Boot',
  springboot: 'Spring Boot',
  'tailwind-css': 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  typescript: 'TypeScript',
  vue: 'Vue',
  'vue-js': 'Vue',
  vuejs: 'Vue',
}

const technologyCategories = [
  {
    name: 'framework',
    priority: 0,
    items: [
      'Vue',
      'React',
      'Angular',
      'Spring Boot',
      'Express',
      'Node.js',
      '.NET',
      'Bootstrap',
      'Tailwind CSS',
      'Vite',
    ],
  },
  {
    name: 'language',
    priority: 1,
    items: ['JavaScript', 'TypeScript', 'Python', 'C#', 'Java', 'HTML', 'CSS'],
  },
  {
    name: 'data',
    priority: 2,
    items: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
  },
  {
    name: 'tool',
    priority: 3,
    items: ['GitHub', 'Git', 'Docker', 'AWS', 'Vercel'],
  },
]

const categoryByTechnology = new Map(
  technologyCategories.flatMap((category) =>
    category.items.map((item, index) => [
      item.toLowerCase(),
      {
        index,
        name: category.name,
        priority: category.priority,
      },
    ]),
  ),
)

function normalizeTechnologyName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replaceAll('_', '-')
    .replaceAll(' ', '-')
}

function toDisplayTechnology(value) {
  const normalized = normalizeTechnologyName(value)

  if (!normalized) return ''

  return technologyAliases[normalized]
    || normalized
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
}

function sortTechnologiesByCategory(technologies) {
  return unique(technologies.map(toDisplayTechnology))
    .sort((first, second) => {
      const firstCategory = categoryByTechnology.get(first.toLowerCase())
      const secondCategory = categoryByTechnology.get(second.toLowerCase())
      const firstPriority = firstCategory?.priority ?? 10
      const secondPriority = secondCategory?.priority ?? 10

      if (firstPriority !== secondPriority) return firstPriority - secondPriority

      const firstIndex = firstCategory?.index ?? Number.MAX_SAFE_INTEGER
      const secondIndex = secondCategory?.index ?? Number.MAX_SAFE_INTEGER

      if (firstIndex !== secondIndex) return firstIndex - secondIndex

      return first.localeCompare(second)
    })
}

function getProjectType(technologies, fallback) {
  return technologies.find((technology) => {
    const category = categoryByTechnology.get(technology.toLowerCase())

    return category?.name === 'framework'
  }) || fallback || 'Repo'
}

function getContributionLevel(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

function formatDateRange(date) {
  if (!date) return 'Actualizado recientemente'

  const formatter = new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    year: 'numeric',
  })

  return formatter.format(new Date(date))
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function getDomain(homepageUrl, fallback) {
  const normalizedUrl = normalizeExternalUrl(homepageUrl)

  try {
    return normalizedUrl ? new URL(normalizedUrl).hostname : fallback
  } catch {
    return fallback
  }
}

function normalizeExternalUrl(value) {
  const url = String(value || '').trim()

  if (!url) return ''

  if (/^https?:\/\//i.test(url)) return url

  return `https://${url}`
}

function getRepositoryOpenGraphImage(username, repoName) {
  return `https://opengraph.githubassets.com/portfolio/${username}/${repoName}`
}

function getWebsiteScreenshot(homepageUrl) {
  const normalizedUrl = normalizeExternalUrl(homepageUrl)

  if (!normalizedUrl) return null

  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(normalizedUrl)}?w=1200`
}

function mapRepositoryToProject(repo, username) {
  const languages = repo.languages.nodes.map((language) => language.name)
  const topics = repo.repositoryTopics.nodes.map((node) => node.topic.name)
  const technologyList = sortTechnologiesByCategory([
    ...topics,
    repo.primaryLanguage?.name,
    ...languages,
  ]).slice(0, 7)
  const fallbackDomain = `github.com/${username}/${repo.name}`
  const fallbackImage = getRepositoryOpenGraphImage(username, repo.name)
  const homepageUrl = normalizeExternalUrl(repo.homepageUrl)

  return {
    date: formatDateRange(repo.pushedAt),
    description: repo.description || 'Repositorio publico de GitHub con codigo, commits y actividad real.',
    domain: getDomain(homepageUrl, fallbackDomain),
    image: getWebsiteScreenshot(homepageUrl) || fallbackImage,
    imageFallback: fallbackImage,
    technologies: technologyList.length ? technologyList : ['GitHub'],
    title: repo.name,
    type: getProjectType(technologyList, repo.primaryLanguage?.name),
    url: homepageUrl || repo.url,
  }
}

function mapGitHubProfile(user, username) {
  const repos = user.repositories.nodes.filter((repo) => !repo.isFork && !repo.isArchived)
  const totalStars = repos.reduce((total, repo) => total + repo.stargazerCount, 0)
  const totalForks = repos.reduce((total, repo) => total + repo.forkCount, 0)
  const languages = unique(repos.map((repo) => repo.primaryLanguage?.name))
  const repoLanguages = unique(repos.flatMap((repo) => repo.languages.nodes.map((language) => language.name)))
  const topics = unique(
    repos.flatMap((repo) => repo.repositoryTopics.nodes.map((node) => node.topic.name)),
  )
  const projects = [...repos]
    .sort((first, second) => {
      if (second.stargazerCount !== first.stargazerCount) {
        return second.stargazerCount - first.stargazerCount
      }

      return new Date(second.pushedAt) - new Date(first.pushedAt)
    })
    .map((repo) => mapRepositoryToProject(repo, username))

  return {
    contributionWeeks: user.contributionsCollection.contributionCalendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        count: day.contributionCount,
        date: day.date,
        level: getContributionLevel(day.contributionCount),
      })),
    ),
    followers: user.followers.totalCount,
    publicRepos: user.repositories.totalCount,
    projects,
    technologies: sortTechnologiesByCategory([...topics, ...repoLanguages, ...languages]).slice(0, 18),
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    totalForks,
    totalStars,
    username,
  }
}

async function requestGitHubProfilePage(token, username, repositoriesAfter) {
  const githubResponse = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: githubPortfolioQuery,
      variables: { repositoriesAfter, username },
    }),
  })

  const payload = await githubResponse.json()

  return {
    ok: githubResponse.ok,
    payload,
    status: githubResponse.status,
  }
}

export default async function handler(request, response) {
  const token = process.env.GITHUB_TOKEN
  const username = request.query.username || 'Xeomus'

  // This endpoint only protects the secret token. The data comes from GitHub's native GraphQL API.
  if (!token) {
    response.status(500).json({ error: 'Missing GITHUB_TOKEN environment variable.' })
    return
  }

  try {
    let profileUser = null
    let repositoriesAfter = null
    const repositories = []

    do {
      const { ok, payload, status } = await requestGitHubProfilePage(
        token,
        username,
        repositoriesAfter,
      )

      if (!ok || payload.errors?.length) {
        response.status(status || 502).json({
          error: 'GitHub GraphQL request failed.',
          details: payload.errors,
        })
        return
      }

      if (!payload.data.user) {
        response.status(404).json({ error: `GitHub user "${username}" was not found.` })
        return
      }

      profileUser = profileUser || payload.data.user
      repositories.push(...payload.data.user.repositories.nodes)
      repositoriesAfter = payload.data.user.repositories.pageInfo.hasNextPage
        ? payload.data.user.repositories.pageInfo.endCursor
        : null
    } while (repositoriesAfter)

    profileUser.repositories.nodes = repositories

    response.setHeader('Cache-Control', 'no-store, max-age=0')
    response.status(200).json(mapGitHubProfile(profileUser, username))
  } catch (error) {
    response.status(500).json({
      error: 'Unable to load GitHub profile.',
      message: error.message,
    })
  }
}
