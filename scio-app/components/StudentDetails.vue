<template>
  <div class="bg-white rounded-lg border border-slate-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-900">Student Details</h3>
      <button class="text-slate-400 hover:text-slate-600 transition-colors" @click="$emit('close')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-8 text-slate-600">
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
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
      Loading details...
    </div>

    <div v-else-if="error" class="p-4 text-red-800 bg-red-50 rounded-lg border border-red-200">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        Error loading details: {{ error }}
      </div>
    </div>

    <div v-else-if="data" class="space-y-6">
      <!-- Student Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-50 p-4 rounded-lg">
          <h4 class="text-sm font-semibold text-slate-700 mb-2">Student Information</h4>
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Name:</span>
              <span class="text-sm font-medium text-slate-900">{{
                data.nickname || 'Anonymous'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Device ID:</span>
              <span class="text-sm font-mono text-slate-700">{{ data.deviceId.slice(-12) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Joined:</span>
              <span class="text-sm text-slate-700">{{ formatDate(data.joinedAt) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 p-4 rounded-lg">
          <h4 class="text-sm font-semibold text-slate-700 mb-2">Group Information</h4>
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Group:</span>
              <span class="text-sm font-medium text-slate-900">{{ data.groupName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Progress:</span>
              <span
                class="text-sm font-medium"
                :class="{
                  'text-red-600': data.currentCompletion < 34,
                  'text-yellow-600': data.currentCompletion >= 34 && data.currentCompletion < 67,
                  'text-green-600': data.currentCompletion >= 67,
                }"
              >
                {{ data.currentCompletion }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Messages:</span>
              <span class="text-sm font-medium text-slate-900">{{ data.totalMessages }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Goal Description and Progress -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h4 class="text-sm font-semibold text-blue-800 mb-1">Goal</h4>
            <p class="text-sm text-blue-700">{{ data.groupDescription }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-800">{{ data.currentCompletion }}%</div>
            <div class="text-xs text-blue-600 uppercase tracking-wider">Progress</div>
          </div>
        </div>
        <div class="w-full bg-blue-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :class="{
              'bg-green-500': data.currentCompletion >= 67,
              'bg-yellow-500': data.currentCompletion >= 34 && data.currentCompletion < 67,
              'bg-red-500': data.currentCompletion < 34,
            }"
            :style="{ width: `${data.currentCompletion}%` }"
          ></div>
        </div>
      </div>

      <!-- Messages History -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-semibold text-slate-700">Student Messages</h4>
          <div class="flex items-center text-xs text-slate-500">
            <div class="flex items-center mr-4">
              <div class="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
              <span>Helpful for goal</span>
            </div>
            <span>{{ userMessages.length }} messages</span>
          </div>
        </div>

        <div
          v-if="!userMessages || userMessages.length === 0"
          class="text-center py-8 text-slate-500"
        >
          <svg
            class="w-16 h-16 mx-auto mb-3 text-slate-300"
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
          <p class="text-base font-medium">No messages yet</p>
          <p class="text-sm mt-1">
            The conversation will appear here once the student starts chatting
          </p>
        </div>

        <div v-else class="space-y-2">
          <!-- Only user messages displayed in chronological order -->
          <div v-for="message in userMessages" :key="message.id" class="group relative">
            <div class="flex items-start space-x-3 py-2">
              <!-- Student Avatar -->
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-slate-700">
                    {{ getInitials(data.nickname) }}
                  </span>
                </div>
              </div>

              <!-- Message Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <p class="text-sm font-medium text-slate-900">
                    {{ data.nickname || 'Anonymous' }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{ formatMessageTime(message.createdAt) }}
                  </p>
                  <!-- Helpful message indicator -->
                  <div
                    v-if="message.contributedToGoal"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    title="This message helped solve the goal"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Helpful
                  </div>
                </div>

                <!-- Message text with helpful highlighting -->
                <div
                  class="mt-1 text-sm text-slate-700 p-3 rounded-lg"
                  :class="{
                    'bg-green-50 border-l-4 border-green-400': message.contributedToGoal,
                    'bg-slate-50': !message.contributedToGoal,
                  }"
                >
                  {{ message.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-4 border-t border-slate-200">
        <div class="text-xs text-slate-500">
          Last updated:
          {{ formatDate(userMessages[userMessages.length - 1]?.createdAt || data.joinedAt) }}
        </div>

        <div class="flex gap-2">
          <button
            class="inline-flex items-center px-3 py-1 border border-slate-300 text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            @click="refreshDetails"
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StudentDetail } from '../server/api/dashboard/student/[deviceId]/[groupId].get'
import { MessageSource } from '../types/api'

// Props
const props = defineProps<{
  deviceId: string
  groupId: string
}>()

// Emits
defineEmits<{
  close: []
}>()

// Fetch student details
const {
  data,
  pending,
  error,
  refresh: refreshDetails,
} = await useFetch<StudentDetail>(`/api/dashboard/student/${props.deviceId}/${props.groupId}`)

// Computed property to get user messages only, sorted chronologically
const userMessages = computed(() => {
  if (!data.value?.messages) return []
  return [...data.value.messages]
    .filter((message) => message.source === MessageSource.User)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
})

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatMessageTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const getInitials = (name: string | null): string => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
