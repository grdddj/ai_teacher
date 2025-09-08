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

      <!-- Set Nickname Form -->
      <div
        v-else-if="needsNickname"
        class="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
      >
        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-2">Almost there!</h2>
          <p class="text-slate-600">Please enter your nickname to complete joining the group</p>
        </div>

        <form class="space-y-6" @submit.prevent="setNickname">
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
            :disabled="settingNickname || !nickname.trim()"
            class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="settingNickname"
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
            {{ settingNickname ? 'Setting nickname...' : 'Set Nickname' }}
          </button>
        </form>
      </div>

      <!-- Chat Interface -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Chat Header -->
        <div class="bg-slate-50 border-b border-slate-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">{{ joinData?.group?.name }}</h2>
              <p class="text-sm text-slate-600">Welcome, {{ joinData?.deviceNickname }}!</p>
            </div>
            <div class="flex items-center text-green-600">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm font-medium">Connected</span>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="h-96 overflow-y-auto p-4 space-y-3">
          <div
            v-for="message in joinData?.messages || []"
            :key="message.id"
            class="flex"
            :class="{
              'justify-center': message.source === MessageSource.System,
              'justify-end': message.source === MessageSource.User,
            }"
          >
            <!-- System Message -->
            <div
              v-if="message.source === MessageSource.System"
              class="max-w-md mx-auto px-4 py-3 rounded-lg text-sm bg-blue-50 text-blue-800 border border-blue-200 text-center"
            >
              <div class="flex items-center justify-center mb-2">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="font-medium text-xs">GOAL</span>
              </div>
              <div class="leading-relaxed">{{ message.content }}</div>
              <div class="text-xs mt-2 opacity-70 text-blue-600">
                {{ formatMessageTime(message.createdAt) }}
              </div>
            </div>

            <!-- User Message -->
            <div
              v-else
              class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm bg-blue-500 text-white"
            >
              <div>{{ message.content }}</div>
              <div class="text-xs mt-1 opacity-70 text-blue-100">
                {{ formatMessageTime(message.createdAt) }}
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!joinData?.messages?.length" class="text-center py-8">
            <div class="text-slate-400 mb-2">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p class="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        </div>

        <!-- Message Input Area (placeholder for future) -->
        <div class="border-t border-slate-200 p-4">
          <div class="flex items-center text-slate-400 text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Message input will be available in the next step
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type {
  JoinGroupRequest,
  JoinGroupResponse,
  UpdateNicknameRequest,
  UpdateNicknameResponse,
} from '../../../types/api'
import { MessageSource } from '../../../types/api'

// Get the groupId from the route
const route = useRoute()
const groupId = route.params.groupId as string

// Reactive state
const pending = ref(true)
const error = ref('')
const joined = ref(false)
const needsNickname = ref(false)
const settingNickname = ref(false)
const nickname = ref('')
const joinData = ref<JoinGroupResponse | null>(null)

// Template refs
const messagesContainer = ref<HTMLElement | null>(null)

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

// Try to join group automatically with deviceId
const attemptJoinGroup = async () => {
  try {
    const deviceId = getDeviceId()

    const requestBody: JoinGroupRequest = {
      groupId,
      deviceId: deviceId || undefined,
    }

    const response = await $fetch<JoinGroupResponse>('/api/groups/join', {
      method: 'POST',
      body: requestBody,
    })

    // Store the device ID
    if (response.deviceId) {
      setDeviceId(response.deviceId)
    }

    joinData.value = response

    // Check if user has a nickname
    if (response.deviceNickname) {
      // User has nickname, they're fully joined
      joined.value = true
      // Scroll to bottom after messages are rendered
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      // User needs to set nickname
      needsNickname.value = true
    }

    pending.value = false
  } catch (err: any) {
    console.error('Failed to join group:', err)
    error.value = err.message || 'Failed to join group'
    pending.value = false
  }
}

// Set nickname function
const setNickname = async () => {
  if (!nickname.value.trim() || !joinData.value) return

  settingNickname.value = true
  error.value = ''

  try {
    const requestBody: UpdateNicknameRequest = {
      deviceId: joinData.value.deviceId,
      nickname: nickname.value.trim(),
    }

    await $fetch<UpdateNicknameResponse>('/api/devices/nickname', {
      method: 'POST',
      body: requestBody,
    })

    // Update local data
    if (joinData.value) {
      joinData.value.deviceNickname = nickname.value.trim()
    }

    // Mark as fully joined
    needsNickname.value = false
    joined.value = true

    // Scroll to bottom after UI update
    nextTick(() => {
      scrollToBottom()
    })
  } catch (err: any) {
    console.error('Failed to set nickname:', err)
    error.value = err.message || 'Failed to set nickname'
  } finally {
    settingNickname.value = false
  }
}

// Initialize on mount
onMounted(() => {
  if (!groupId) {
    error.value = 'Invalid group ID'
    pending.value = false
    return
  }

  attemptJoinGroup()
})

// Utility function to format message timestamp
const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// Scroll to bottom of messages when new messages arrive
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>
