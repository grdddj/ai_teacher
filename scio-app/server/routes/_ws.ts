interface DashboardEvent {
  type: 'student_joined' | 'message_sent' | 'progress_updated'
  data: any
}

const connectedPeers = new Set()

export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] New connection opened', peer.id)
    connectedPeers.add(peer)

    // Send welcome message with connection type
    peer.send(
      JSON.stringify({
        type: 'connection',
        message: 'Connected to dashboard updates',
      })
    )
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.text())
      console.log('[ws] Message received', peer.id, data)

      // Handle different message types
      if (data.type === 'subscribe_dashboard') {
        // Client is subscribing to dashboard updates
        peer.send(
          JSON.stringify({
            type: 'subscribed',
            message: 'Subscribed to dashboard updates',
          })
        )
      }
    } catch (error) {
      console.error('[ws] Error parsing message:', error)
      peer.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        })
      )
    }
  },

  close(peer, event) {
    console.log('[ws] Connection closed', peer.id, event.code, event.reason)
    connectedPeers.delete(peer)
  },

  error(peer, error) {
    console.log('[ws] WebSocket error', peer.id, error)
    connectedPeers.delete(peer)
  },
})

// Export function to broadcast events to all connected dashboard clients
export function broadcastDashboardEvent(event: DashboardEvent) {
  console.log('[ws] Broadcasting dashboard event:', event.type)

  const message = JSON.stringify(event)

  // Send to all connected peers
  connectedPeers.forEach((peer: any) => {
    try {
      peer.send(message)
    } catch (error) {
      console.error('[ws] Error sending to peer:', error)
      // Remove dead connections
      connectedPeers.delete(peer)
    }
  })
}
