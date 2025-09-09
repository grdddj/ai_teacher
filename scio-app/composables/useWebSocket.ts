export interface WebSocketMessage {
  id: string
  type: string
  data: any
  timestamp: number
}

export interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectInterval?: number
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = '/_ws',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 1000,
  } = options

  const isConnected = ref(false)
  const isConnecting = ref(false)
  const lastMessage = ref<WebSocketMessage | null>(null)
  const error = ref<string | null>(null)

  let ws: WebSocket | null = null
  let reconnectCount = 0
  let reconnectTimer: NodeJS.Timeout | null = null

  const connect = () => {
    if (import.meta.server) return

    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
      return
    }

    isConnecting.value = true
    error.value = null

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = url.startsWith('ws') ? url : `${protocol}//${window.location.host}${url}`

      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        reconnectCount = 0
        console.log('WebSocket connected')
      }

      ws.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data)
          lastMessage.value = {
            id: messageData.id || Date.now().toString(),
            type: messageData.type || 'message',
            data: messageData.data || event.data,
            timestamp: Date.now(),
          }
        } catch {
          // If not JSON, treat as plain text
          lastMessage.value = {
            id: Date.now().toString(),
            type: 'message',
            data: event.data,
            timestamp: Date.now(),
          }
        }
      }

      ws.onclose = (event) => {
        isConnected.value = false
        isConnecting.value = false

        if (!event.wasClean && reconnectCount < reconnectAttempts) {
          reconnectCount++
          console.log(
            `WebSocket closed. Attempting to reconnect... (${reconnectCount}/${reconnectAttempts})`
          )

          reconnectTimer = setTimeout(() => {
            connect()
          }, reconnectInterval * reconnectCount)
        } else {
          console.log('WebSocket connection closed')
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        error.value = 'WebSocket connection error'
        isConnecting.value = false
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      error.value = 'Failed to create WebSocket connection'
      isConnecting.value = false
    }
  }

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    if (ws) {
      ws.close(1000, 'Manual disconnect')
      ws = null
    }

    isConnected.value = false
    isConnecting.value = false
    reconnectCount = 0
  }

  const send = (message: any) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected. Cannot send message:', message)
      return false
    }

    try {
      const payload = typeof message === 'string' ? message : JSON.stringify(message)
      ws.send(payload)
      return true
    } catch (err) {
      console.error('Failed to send WebSocket message:', err)
      error.value = 'Failed to send message'
      return false
    }
  }

  // Auto-connect if enabled
  if (autoConnect) {
    onMounted(() => {
      connect()
    })
  }

  // Clean up on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    lastMessage: readonly(lastMessage),
    error: readonly(error),
    connect,
    disconnect,
    send,
  }
}
