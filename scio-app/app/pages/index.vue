<template>
  <div>
    <h1>Hello World Nuxt App</h1>
    
    <div>
      <h2>API Response:</h2>
      
      <div v-if="pending">
        Loading...
      </div>
      
      <div v-else-if="error">
        Error: {{ error }}
      </div>
      
      <div v-else-if="data">
        <p><strong>Message:</strong> {{ data.message }}</p>
        <p><strong>Timestamp:</strong> {{ data.timestamp }}</p>
      </div>
      
      <button @click="refresh()">
        Refresh
      </button>
    </div>
  </div>
</template>

<script setup>
// Use Nuxt's built-in useFetch composable
const { data, pending, error, refresh } = await useFetch('/api/hello')
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