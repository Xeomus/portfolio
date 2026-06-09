const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const githubPortfolioQuery = `
  query PortfolioProfile($username: String!) {
    user(login: $username) {
      followers {
        totalCount
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        privacy: PUBLIC
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
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
          languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              name
            }
          }
          repositoryTopics(first: 8) {
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
  if (!homepageUrl) return fallback

  try {
    return new URL(homepageUrl).hostname
  } catch {
    return fallback
  }
}

function mapRepositoryToProject(repo, username) {
  const languages = repo.languages.nodes.map((language) => language.name)
  const topics = repo.repositoryTopics.nodes.map((node) => node.topic.name)
  const technologyList = unique([...languages, repo.primaryLanguage?.name, ...topics]).slice(0, 7)
  const fallbackDomain = `github.com/${username}/${repo.name}`

  return {
    date: formatDateRange(repo.pushedAt),
    description: repo.description || 'Repositorio publico de GitHub con codigo, commits y actividad real.',
    domain: getDomain(repo.homepageUrl, fallbackDomain),
    image: `https://opengraph.githubassets.com/portfolio/${username}/${repo.name}`,
    technologies: technologyList.length ? technologyList : ['GitHub'],
    title: repo.name,
    type: repo.primaryLanguage?.name || 'Repo',
    url: repo.homepageUrl || repo.url,
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
    .slice(0, 3)
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
    technologies: unique([...repoLanguages, ...languages, ...topics]).slice(0, 18),
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    totalForks,
    totalStars,
    username,
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
    const githubResponse = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: githubPortfolioQuery,
        variables: { username },
      }),
    })

    const payload = await githubResponse.json()

    if (!githubResponse.ok || payload.errors?.length) {
      response.status(githubResponse.status || 502).json({
        error: 'GitHub GraphQL request failed.',
        details: payload.errors,
      })
      return
    }

    if (!payload.data.user) {
      response.status(404).json({ error: `GitHub user "${username}" was not found.` })
      return
    }

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    response.status(200).json(mapGitHubProfile(payload.data.user, username))
  } catch (error) {
    response.status(500).json({
      error: 'Unable to load GitHub profile.',
      message: error.message,
    })
  }
}
