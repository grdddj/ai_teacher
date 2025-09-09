<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-slate-900 text-center">Student Progress Dashboard</h1>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                {{ dashboardData?.totalStudents || 0 }}
              </div>
              <div class="text-sm text-slate-600">Active Students</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">
                {{ dashboardData?.activeGroups || 0 }}
              </div>
              <div class="text-sm text-slate-600">Active Groups</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ averageCompletion }}%</div>
              <div class="text-sm text-slate-600">Avg Progress</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ totalMessages }}</div>
              <div class="text-sm text-slate-600">Total Messages</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex items-center gap-4">
          <button
            class="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="dashboardPending"
            @click="customRefreshDashboard"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ dashboardPending ? 'Refreshing...' : 'Refresh' }}
          </button>

          <NuxtLink
            to="/groups"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Manage Groups
          </NuxtLink>
        </div>
      </div>

      <!-- Students Progress Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200">
          <h2 class="text-xl font-semibold text-slate-900">Student Progress</h2>
          <p class="text-sm text-slate-600 mt-1">Monitor real-time student activity and progress</p>
        </div>

        <div v-if="dashboardPending" class="flex items-center justify-center py-12 text-slate-600">
          <svg
            class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading student data...
        </div>

        <div
          v-else-if="dashboardError"
          class="flex items-center justify-center p-8 text-red-800 bg-red-50"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          Error loading dashboard: {{ dashboardError }}
        </div>

        <div v-else-if="!dashboardData?.students?.length" class="text-center py-12">
          <div class="text-slate-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p class="text-slate-500 text-lg">No active students found</p>
          <p class="text-slate-400 text-sm mt-2">
            Students will appear here once they join groups and start chatting
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Group
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Messages
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Last Activity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <template
                v-for="student in dashboardData?.students || []"
                :key="`${student.deviceId}-${student.groupId}`"
              >
                <!-- Main Row -->
                <tr
                  class="transition-colors duration-500"
                  :class="{
                    'bg-orange-50 hover:bg-orange-100': recentlyUpdatedRows.has(
                      `${student.deviceId}-${student.groupId}`
                    ),
                    'hover:bg-slate-50': !recentlyUpdatedRows.has(
                      `${student.deviceId}-${student.groupId}`
                    ),
                  }"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3"
                      >
                        <span class="text-sm font-medium text-slate-600">
                          {{ getInitials(student.nickname) }}
                        </span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-slate-900">
                          {{ student.nickname || 'Anonymous' }}
                        </div>
                        <div class="text-xs text-slate-500">
                          ID: {{ student.deviceId.slice(-8) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-900">{{ student.groupName }}</div>
                    <div class="text-xs text-slate-500">{{ student.groupId.slice(-8) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg
                        class="w-4 h-4 mr-1 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span class="text-sm font-medium text-slate-900">{{
                        student.messageCount
                      }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="h-2 rounded-full transition-all duration-300"
                          :class="{
                            'bg-red-500': student.currentCompletion < 34,
                            'bg-yellow-500':
                              student.currentCompletion >= 34 && student.currentCompletion < 67,
                            'bg-green-500': student.currentCompletion >= 67,
                          }"
                          :style="{ width: `${student.currentCompletion}%` }"
                        ></div>
                      </div>
                      <span
                        class="text-sm font-medium"
                        :class="{
                          'text-red-600': student.currentCompletion < 34,
                          'text-yellow-600':
                            student.currentCompletion >= 34 && student.currentCompletion < 67,
                          'text-green-600': student.currentCompletion >= 67,
                        }"
                      >
                        {{ student.currentCompletion }}%
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {{ formatRelativeTime(student.lastActivity) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mr-2"
                      @click="toggleStudentDetails(student.deviceId, student.groupId)"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      {{
                        expandedRows.has(`${student.deviceId}-${student.groupId}`)
                          ? 'Hide'
                          : 'Details'
                      }}
                    </button>
                  </td>
                </tr>

                <!-- Expandable Details Row -->
                <tr
                  v-if="expandedRows.has(`${student.deviceId}-${student.groupId}`)"
                  class="bg-slate-50"
                >
                  <td colspan="6" class="px-6 py-6">
                    <StudentDetails
                      :ref="(el) => setStudentDetailsRef(el, student.deviceId, student.groupId)"
                      :device-id="student.deviceId"
                      :group-id="student.groupId"
                      @close="toggleStudentDetails(student.deviceId, student.groupId)"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardData, StudentProgress } from '../../server/api/dashboard/students.get'
import StudentDetails from '../../components/StudentDetails.vue'

// Fetch dashboard data
const {
  data: fetchedDashboardData,
  pending: dashboardPending,
  error: dashboardError,
  refresh: refreshDashboard,
} = await useFetch<DashboardData>('/api/dashboard/students')

// Create a reactive copy that we can mutate
const dashboardData = ref<DashboardData | null>(null)

// Initialize with fetched data
if (fetchedDashboardData.value) {
  dashboardData.value = JSON.parse(JSON.stringify(fetchedDashboardData.value))
}

// Watch for changes in fetched data (only when it's a fresh fetch, not our updates)
let isUpdatingFromWebSocket = false
watch(fetchedDashboardData, (newData) => {
  if (newData && !isUpdatingFromWebSocket) {
    dashboardData.value = JSON.parse(JSON.stringify(newData))
  }
})

// Create a custom refresh function that updates our reactive copy
const customRefreshDashboard = async () => {
  await refreshDashboard()
  if (fetchedDashboardData.value) {
    dashboardData.value = JSON.parse(JSON.stringify(fetchedDashboardData.value))
  }
}

// Track expanded rows
const expandedRows = ref(new Set<string>())

// Track recently updated rows for visual feedback
const recentlyUpdatedRows = ref(new Set<string>())
const highlightTimeouts = new Map<string, NodeJS.Timeout>()

// Track references to open StudentDetails components
const studentDetailsRefs = ref(new Map<string, any>())

// Computed values for summary stats
const averageCompletion = computed(() => {
  if (!dashboardData.value?.students?.length) return 0
  const sum = dashboardData.value.students.reduce(
    (acc, student) => acc + student.currentCompletion,
    0
  )
  return Math.round(sum / dashboardData.value.students.length)
})

const totalMessages = computed(() => {
  if (!dashboardData.value?.students?.length) return 0
  return dashboardData.value.students.reduce((acc, student) => acc + student.messageCount, 0)
})

// Helper functions
const getInitials = (name: string | null): string => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Client-side reactive time for avoiding hydration mismatches
const currentTime = ref(new Date())

// Update current time every minute to keep relative times fresh
let timeInterval: NodeJS.Timeout
onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 60000) // Update every minute
})

// Moved to single onUnmounted hook below

const formatRelativeTime = (dateString: string): string => {
  // For SSR compatibility, return a simple format initially
  if (typeof window === 'undefined') {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const date = new Date(dateString)
  const now = currentTime.value
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(diffDays > 365 ? { year: 'numeric' } : {}),
  })
}

// Helper function to set component refs
const setStudentDetailsRef = (el: any, deviceId: string, groupId: string) => {
  const key = `${deviceId}-${groupId}`
  if (el) {
    studentDetailsRefs.value.set(key, el)
  } else {
    studentDetailsRefs.value.delete(key)
  }
}

const toggleStudentDetails = (deviceId: string, groupId: string) => {
  const key = `${deviceId}-${groupId}`
  const newSet = new Set(expandedRows.value)

  if (newSet.has(key)) {
    newSet.delete(key)
    // Clean up the ref when closing
    studentDetailsRefs.value.delete(key)
  } else {
    newSet.add(key)
  }

  expandedRows.value = newSet
}

// Helper function to highlight a row temporarily
const highlightRow = (deviceId: string, groupId: string) => {
  const key = `${deviceId}-${groupId}`

  // Clear existing timeout if any
  const existingTimeout = highlightTimeouts.get(key)
  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }

  const newSet = new Set(recentlyUpdatedRows.value)
  newSet.add(key)
  recentlyUpdatedRows.value = newSet

  // Remove highlight after 10 seconds
  const timeout = setTimeout(() => {
    const currentSet = new Set(recentlyUpdatedRows.value)
    currentSet.delete(key)
    recentlyUpdatedRows.value = currentSet
    highlightTimeouts.delete(key)
  }, 10000)

  highlightTimeouts.set(key, timeout)
}

// Helper function to refresh student details if they're currently open
const refreshOpenStudentDetails = (deviceId: string, groupId: string) => {
  const key = `${deviceId}-${groupId}`
  const detailsComponent = studentDetailsRefs.value.get(key)
  if (detailsComponent && expandedRows.value.has(key)) {
    detailsComponent.refreshDetails()
  }
}

// Helper functions for selective updates
const findStudentIndex = (deviceId: string, groupId: string): number => {
  if (!dashboardData.value?.students) return -1
  return dashboardData.value.students.findIndex(
    (student) => student.deviceId === deviceId && student.groupId === groupId
  )
}

const updateStudentRow = (deviceId: string, groupId: string, updates: Partial<StudentProgress>) => {
  if (!dashboardData.value?.students) return

  const studentIndex = findStudentIndex(deviceId, groupId)
  if (studentIndex === -1) return

  const originalStudent = dashboardData.value.students[studentIndex]
  const updatedStudent = { ...originalStudent, ...updates } as StudentProgress

  // Set flag to prevent watcher conflicts
  isUpdatingFromWebSocket = true

  // Remove the student from current position and add to top
  const newStudents = [...dashboardData.value.students]
  newStudents.splice(studentIndex, 1) // Remove from current position
  newStudents.unshift(updatedStudent) // Add to top

  // Create a completely new dashboard data object to ensure reactivity
  const newDashboardData = {
    ...dashboardData.value,
    students: newStudents,
  }

  // Update the entire dashboard data
  dashboardData.value = newDashboardData

  // Reset flag after a short delay
  nextTick(() => {
    isUpdatingFromWebSocket = false
  })

  // Highlight the updated row
  highlightRow(deviceId, groupId)
}

const addNewStudent = async (studentData: any) => {
  // Fetch the full student data for the new student
  try {
    const response = await $fetch<DashboardData>('/api/dashboard/students')
    const newStudent = response.students.find(
      (s) => s.deviceId === studentData.deviceId && s.groupId === studentData.groupId
    )

    if (newStudent && dashboardData.value?.students) {
      // Set flag to prevent watcher conflicts
      isUpdatingFromWebSocket = true

      // Add to the beginning of the array (top of table)
      dashboardData.value.students.unshift(newStudent)
      dashboardData.value.totalStudents = dashboardData.value.students.length

      // Update active groups count
      const uniqueGroups = new Set(dashboardData.value.students.map((s) => s.groupId))
      dashboardData.value.activeGroups = uniqueGroups.size

      // Reset flag after a short delay
      nextTick(() => {
        isUpdatingFromWebSocket = false
      })

      // Highlight the new student row
      highlightRow(newStudent.deviceId, newStudent.groupId)
    }
  } catch (error) {
    console.error('Failed to fetch new student data:', error)
    // Fallback to full refresh
    customRefreshDashboard()
  }
}

// WebSocket connection for real-time updates
const ws = ref<WebSocket | null>(null)

const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/_ws`

  ws.value = new WebSocket(wsUrl)

  ws.value.onopen = () => {
    // Subscribe to dashboard updates
    ws.value?.send(JSON.stringify({ type: 'subscribe_dashboard' }))
  }

  ws.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'student_joined':
          addNewStudent(data.data)
          break

        case 'message_sent': {
          // Increment message count and update last activity
          const studentIndex = findStudentIndex(data.data.deviceId, data.data.groupId)
          if (studentIndex !== -1 && dashboardData.value?.students?.[studentIndex]) {
            const currentCount = dashboardData.value.students[studentIndex].messageCount
            updateStudentRow(data.data.deviceId, data.data.groupId, {
              messageCount: currentCount + 1,
              lastActivity: data.data.timestamp,
              lastMessageAt: data.data.timestamp,
            })
          }
          // Refresh student details if open
          refreshOpenStudentDetails(data.data.deviceId, data.data.groupId)
          break
        }

        case 'progress_updated': {
          // Update completion percentage and last activity
          updateStudentRow(data.data.deviceId, data.data.groupId, {
            currentCompletion: data.data.completion,
            lastActivity: data.data.timestamp,
          })
          // Refresh student details if open
          refreshOpenStudentDetails(data.data.deviceId, data.data.groupId)
          break
        }

        case 'nickname_updated': {
          // Update student nickname
          updateStudentRow(data.data.deviceId, data.data.groupId, {
            nickname: data.data.nickname,
          })
          // Refresh student details if open
          refreshOpenStudentDetails(data.data.deviceId, data.data.groupId)
          break
        }

        case 'connection':
        case 'subscribed':
          break

        case 'error':
          console.error('[Dashboard] WebSocket error:', data.message)
          break
      }
    } catch (error) {
      console.error('[Dashboard] Error parsing WebSocket message:', error)
    }
  }

  ws.value.onclose = () => {
    setTimeout(connectWebSocket, 3000)
  }

  ws.value.onerror = (error) => {
    console.error('[Dashboard] WebSocket error:', error)
  }
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  // Clear time interval
  if (timeInterval) {
    clearInterval(timeInterval)
  }

  // Close WebSocket connection
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }

  // Clear all highlight timeouts
  highlightTimeouts.forEach((timeout) => {
    clearTimeout(timeout)
  })
  highlightTimeouts.clear()

  // Clear student details refs
  studentDetailsRefs.value.clear()
})
</script>
