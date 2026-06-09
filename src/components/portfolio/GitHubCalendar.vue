<script setup>
import { computed } from 'vue'

const props = defineProps({
  weeks: {
    type: Array,
    required: true,
  },
})

const cellSize = 11
const cellGap = 4
const monthLabelHeight = 20
const dayLabelWidth = 28
const chartWidth = computed(() => dayLabelWidth + props.weeks.length * (cellSize + cellGap))
const chartHeight = monthLabelHeight + 7 * (cellSize + cellGap)
const dayLabels = ['Mon', 'Wed', 'Fri']

function normalizeDay(day) {
  if (typeof day === 'number') {
    return {
      count: 0,
      date: '',
      level: day,
    }
  }

  return day
}

function getDay(week, dayIndex) {
  return normalizeDay(week[dayIndex] ?? 0)
}

function getMonthLabels(weeks) {
  const labels = []
  let previousMonth = null

  weeks.forEach((week, weekIndex) => {
    const firstDatedDay = week.map(normalizeDay).find((day) => day.date)

    if (!firstDatedDay) return

    const date = new Date(`${firstDatedDay.date}T00:00:00`)
    const month = date.getMonth()

    if (month !== previousMonth) {
      labels.push({
        label: date.toLocaleString('en', { month: 'short' }),
        x: dayLabelWidth + weekIndex * (cellSize + cellGap),
      })
      previousMonth = month
    }
  })

  return labels
}

const monthLabels = computed(() => getMonthLabels(props.weeks))
</script>

<template>
  <div class="github-calendar">
    <svg
      class="github-calendar-svg"
      :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
      role="img"
      aria-label="GitHub contribution calendar"
    >
      <g class="month-labels">
        <text v-for="month in monthLabels" :key="`${month.label}-${month.x}`" :x="month.x" y="12">
          {{ month.label }}
        </text>
      </g>

      <g class="day-labels">
        <text
          v-for="(label, index) in dayLabels"
          :key="label"
          x="0"
          :y="monthLabelHeight + (index * 2 + 1) * (cellSize + cellGap) + 8"
        >
          {{ label }}
        </text>
      </g>

      <g>
        <template v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <rect
            v-for="dayIndex in 7"
            :key="`${weekIndex}-${dayIndex}`"
            class="calendar-cell"
            :class="`level-${getDay(week, dayIndex - 1).level}`"
            :x="dayLabelWidth + weekIndex * (cellSize + cellGap)"
            :y="monthLabelHeight + (dayIndex - 1) * (cellSize + cellGap)"
            :width="cellSize"
            :height="cellSize"
            rx="2.5"
          >
            <title>
              {{
                getDay(week, dayIndex - 1).date
                  ? `${getDay(week, dayIndex - 1).count} contributions on ${getDay(week, dayIndex - 1).date}`
                  : 'No contribution data'
              }}
            </title>
          </rect>
        </template>
      </g>
    </svg>

    <div class="calendar-legend" aria-hidden="true">
      <span>Less</span>
      <span class="legend-cell level-0"></span>
      <span class="legend-cell level-1"></span>
      <span class="legend-cell level-2"></span>
      <span class="legend-cell level-3"></span>
      <span class="legend-cell level-4"></span>
      <span>More</span>
    </div>
  </div>
</template>
