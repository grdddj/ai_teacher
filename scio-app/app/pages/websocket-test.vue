<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">WebSocket Test</h1>

    <div class="mb-4">
      <button
        :disabled="connected"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
        @click="connect"
      >
        Connect
      </button>
      <button
        :disabled="!connected"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        @click="disconnect"
      >
        Disconnect
      </button>
    </div>

    <div class="mb-4">
      <div class="flex">
        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message..."
          class="flex-1 p-2 border border-gray-300 rounded-l"
          :disabled="!connected"
          @keyup.enter="sendMessage"
        />
        <button
          :disabled="!connected || !messageInput.trim()"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50"
          @click="sendMessage"
        >
          Send
        </button>
      </div>
    </div>

    <div class="mb-4">
      <p class="font-semibold">
        Status:
        <span :class="connected ? 'text-green-600' : 'text-red-600'">
          {{ connected ? 'Connected' : 'Disconnected' }}
        </span>
      </p>
    </div>

    <div class="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
      <h3 class="font-semibold mb-2">Messages:</h3>
      <div v-for="(message, index) in messages" :key="index" class="mb-1 p-1">
        <span class="text-gray-600 text-xs mr-2">{{ message.timestamp }}</span>
        <span :class="message.type === 'sent' ? 'text-blue-600' : 'text-green-600'">
          {{ message.type === 'sent' ? '→' : '←' }}
        </span>
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const connected = ref(false)
const messageInput = ref('')
const messages = ref<Array<{ content: string; type: 'sent' | 'received'; timestamp: string }>>([])
let ws: WebSocket | null = null

const connect = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/_ws`

  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    connected.value = true
    addMessage('Connected to WebSocket server', 'received')
  }

  ws.onmessage = (event) => {
    addMessage(event.data, 'received')
  }

  ws.onclose = () => {
    connected.value = false
    addMessage('WebSocket connection closed', 'received')
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    addMessage('WebSocket error occurred', 'received')
  }
}

const disconnect = () => {
  if (ws) {
    ws.close()
    ws = null
  }
}

const sendMessage = () => {
  if (ws && ws.readyState === WebSocket.OPEN && messageInput.value.trim()) {
    const message = messageInput.value.trim()
    ws.send(message)
    addMessage(message, 'sent')
    messageInput.value = ''
  }
}

const addMessage = (content: string, type: 'sent' | 'received') => {
  messages.value.push({
    content,
    type,
    timestamp: new Date().toLocaleTimeString(),
  })
}

onUnmounted(() => {
  disconnect()
})
</script>
