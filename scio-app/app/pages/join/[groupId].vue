<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl font-bold text-slate-900 text-center">Join Group</h1>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div class="flex items-center justify-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600"
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
          <span class="text-lg text-slate-600">Loading group...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div class="flex items-center p-4 text-red-800 bg-red-50 rounded-lg border border-red-200">
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          Error: {{ error }}
        </div>
      </div>

      <!-- Join Form -->
      <div v-else-if="!joined" class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-2">Ready to join?</h2>
          <p class="text-slate-600">Please enter your nickname to join the group</p>
        </div>

        <form class="space-y-6" @submit.prevent="joinGroup">
          <div>
            <label for="nickname" class="block text-sm font-medium text-slate-700 mb-2">
              Your Nickname
            </label>
            <input
              id="nickname"
              v-model="nickname"
              type="text"
              placeholder="e.g., John Doe"
              required
              class="w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
            />
          </div>

          <button
            type="submit"
            :disabled="joining || !nickname.trim()"
            class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="joining"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            {{ joining ? 'Joining...' : 'Join Group' }}
          </button>
        </form>
      </div>

      <!-- Success State -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div class="text-center">
          <div
            class="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-green-600 bg-green-100 rounded-full"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-slate-900 mb-2">Welcome to the group!</h2>
          <p class="text-slate-600 mb-4">
            You have successfully joined the group. You can now start participating.
          </p>
          <p class="text-sm text-slate-500">Group: {{ joinData?.group?.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { JoinGroupRequest, JoinGroupResponse } from '../../../types/api'

// Get the groupId from the route
const route = useRoute()
const groupId = route.params.groupId as string

// Reactive state
const pending = ref(true)
const error = ref('')
const joined = ref(false)
const joining = ref(false)
const nickname = ref('')
const joinData = ref<JoinGroupResponse | null>(null)

// Device ID management
const getDeviceId = (): string | null => {
  if (import.meta.client) {
    return localStorage.getItem('deviceId')
  }
  return null
}

const setDeviceId = (deviceId: string): void => {
  if (import.meta.client) {
    localStorage.setItem('deviceId', deviceId)
  }
}

// Check if device is already in this group
const checkExistingMembership = async () => {
  const deviceId = getDeviceId()
  if (!deviceId) {
    pending.value = false
    return
  }

  try {
    // TODO: We'll implement this check when the API endpoint is ready
    // For now, just proceed to nickname input
    pending.value = false
  } catch (err: any) {
    console.error('Error checking membership:', err)
    pending.value = false
  }
}

// Join group function
const joinGroup = async () => {
  if (!nickname.value.trim()) return

  joining.value = true
  error.value = ''

  try {
    const deviceId = getDeviceId()

    const requestBody: JoinGroupRequest = {
      groupId,
      deviceId: deviceId || undefined,
      nickname: nickname.value.trim(),
    }

    const response = await $fetch<JoinGroupResponse>('/api/groups/join', {
      method: 'POST',
      body: requestBody,
    })

    // Store the device ID if it's new
    if (response.deviceId) {
      setDeviceId(response.deviceId)
    }

    joinData.value = response
    joined.value = true
  } catch (err: any) {
    console.error('Failed to join group:', err)
    error.value = err.message || 'Failed to join group'
  } finally {
    joining.value = false
  }
}

// Initialize on mount
onMounted(() => {
  if (!groupId) {
    error.value = 'Invalid group ID'
    pending.value = false
    return
  }

  checkExistingMembership()
})
</script>
