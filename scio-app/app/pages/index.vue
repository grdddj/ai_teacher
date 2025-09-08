<template>
  <div>
    <h1>Student Group Management System</h1>

    <!-- Database Status -->
    <div class="status-section">
      <h2>Database Status</h2>
      <div v-if="statusPending">Checking connection...</div>
      <div v-else-if="statusError">❌ Database Error: {{ statusError }}</div>
      <div v-else-if="statusData">
        <p>✅ {{ statusData.message }}</p>
        <p>📊 Total Groups: {{ statusData.groups_count }}</p>
        <p>🕒 {{ statusData.timestamp }}</p>
      </div>
    </div>

    <!-- Create New Group Form -->
    <div class="form-section">
      <h2>Create New Group</h2>
      <form @submit.prevent="createGroup">
        <div class="form-group">
          <label for="owner_id">Owner ID:</label>
          <input
            id="owner_id"
            v-model="newGroup.owner_id"
            type="text"
            placeholder="e.g., teacher_1"
            required
          />
        </div>

        <div class="form-group">
          <label for="name">Group Name:</label>
          <input
            id="name"
            v-model="newGroup.name"
            type="text"
            placeholder="e.g., A2 - quadratic equations 1"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="newGroup.description"
            placeholder="e.g., solve independently 3 different quadratic equations..."
            required
          />
        </div>

        <button type="submit" :disabled="createPending">
          {{ createPending ? 'Creating...' : 'Create Group' }}
        </button>
      </form>
    </div>

    <!-- Groups Table -->
    <div class="groups-section">
      <h2>Existing Groups</h2>

      <div v-if="groupsPending">Loading groups...</div>

      <div v-else-if="groupsError">Error loading groups: {{ groupsError }}</div>

      <div v-else-if="groupsData && groupsData.groups">
        <div class="groups-summary">
          <p>📋 Found {{ groupsData.count }} groups</p>
          <button @click="refreshGroups()">🔄 Refresh</button>
        </div>

        <table class="groups-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Description</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groupsData.groups" :key="group.id">
              <td class="group-name">{{ group.name }}</td>
              <td class="group-owner">{{ group.owner_id }}</td>
              <td class="group-description">{{ group.description }}</td>
              <td class="group-created">{{ formatDate(group.created_at) }}</td>
            </tr>
          </tbody>
        </table>
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

<style scoped>
div {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #1d4ed8;
}
</style>
