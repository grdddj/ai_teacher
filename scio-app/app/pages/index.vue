<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-slate-900 text-center">
          Student Group Management System
        </h1>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Database Status Card -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center mb-4">
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
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-slate-900">Database Status</h2>
        </div>

        <div v-if="statusPending" class="flex items-center text-slate-600">
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
          Checking connection...
        </div>

        <div
          v-else-if="statusError"
          class="flex items-center p-4 text-red-800 bg-red-50 rounded-lg border border-red-200"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          Database Error: {{ statusError }}
        </div>

        <div v-else-if="statusData" class="space-y-3">
          <div
            class="flex items-center text-green-700 bg-green-50 p-3 rounded-lg border border-green-200"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ statusData.message }}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div class="bg-slate-50 p-3 rounded-lg">
              <div class="text-2xl font-bold text-slate-900">{{ statusData.groups_count }}</div>
              <div class="text-sm text-slate-600">Total Groups</div>
            </div>
            <div class="bg-slate-50 p-3 rounded-lg">
              <div class="text-sm font-medium text-slate-900">{{ statusData.timestamp }}</div>
              <div class="text-xs text-slate-600">Last Updated</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New Group Card -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center mb-6">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-slate-900">Create New Group</h2>
        </div>

        <form class="space-y-6" @submit.prevent="createGroup">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="owner_id" class="block text-sm font-medium text-slate-700 mb-2">
                Owner ID
              </label>
              <input
                id="owner_id"
                v-model="newGroup.owner_id"
                type="text"
                placeholder="e.g., teacher_1"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-slate-700 mb-2">
                Group Name
              </label>
              <input
                id="name"
                v-model="newGroup.name"
                type="text"
                placeholder="e.g., A2 - quadratic equations 1"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="newGroup.description"
              placeholder="e.g., solve independently 3 different quadratic equations..."
              required
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            :disabled="createPending"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="createPending"
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
            {{ createPending ? 'Creating...' : 'Create Group' }}
          </button>
        </form>
      </div>

      <!-- Groups Table Card -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-6">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-900">Existing Groups</h2>
          </div>

          <button
            class="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            @click="refreshGroups()"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div v-if="groupsPending" class="flex items-center justify-center py-8 text-slate-600">
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
          Loading groups...
        </div>

        <div
          v-else-if="groupsError"
          class="flex items-center justify-center p-4 text-red-800 bg-red-50 rounded-lg border border-red-200"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          Error loading groups: {{ groupsError }}
        </div>

        <div v-else-if="groupsData && groupsData.groups">
          <div class="mb-4 p-3 bg-slate-50 rounded-lg">
            <span class="text-sm font-medium text-slate-900">
              Found {{ groupsData.count }} group{{ groupsData.count !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="overflow-hidden border border-slate-200 rounded-lg">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Owner
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr
                  v-for="group in groupsData.groups"
                  :key="group.id"
                  class="hover:bg-slate-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-900">{{ group.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-slate-600">{{ group.owner_id }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-600 max-w-xs truncate">
                      {{ group.description }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {{ formatDate(group.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  HelloResponse,
  GroupsResponse,
  CreateGroupRequest,
  CreateGroupResponse,
} from '../../types/api'

// Fetch database status
const {
  data: statusData,
  pending: statusPending,
  error: statusError,
} = await useFetch<HelloResponse>('/api/hello')

// Fetch groups
const {
  data: groupsData,
  pending: groupsPending,
  error: groupsError,
  refresh: refreshGroups,
} = await useFetch<GroupsResponse>('/api/groups')

// Form data for creating new group
const newGroup = ref<CreateGroupRequest>({
  owner_id: '',
  name: '',
  description: '',
})

// Create group functionality
const createPending = ref(false)

const createGroup = async () => {
  createPending.value = true

  try {
    const response = await $fetch<CreateGroupResponse>('/api/groups', {
      method: 'POST',
      body: newGroup.value,
    })

    // Clear form
    newGroup.value = {
      owner_id: '',
      name: '',
      description: '',
    }

    // Refresh groups list
    await refreshGroups()

    alert(`Group "${response.group.name}" created successfully!`)
  } catch (error: any) {
    console.error('Failed to create group:', error)
    alert('Failed to create group: ' + (error.message || 'Unknown error'))
  } finally {
    createPending.value = false
  }
}

// Utility function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
