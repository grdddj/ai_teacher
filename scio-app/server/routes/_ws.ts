export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] New connection opened', peer.id)
    peer.send('Welcome to WebSocket!')
  },

  message(peer, message) {
    console.log('[ws] Message received', peer.id, message.text())

    // Echo the message back to the sender
    peer.send(`Echo: ${message.text()}`)

    // You can also broadcast to all connected peers
    // peer.publish('chat', message.text())
  },

  close(peer, event) {
    console.log('[ws] Connection closed', peer.id, event.code, event.reason)
  },

  error(peer, error) {
    console.log('[ws] WebSocket error', peer.id, error)
  },
})
