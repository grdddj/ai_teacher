export default defineEventHandler(async (event) => {
  return {
    message: 'Hello World from API!',
    timestamp: new Date().toISOString(),
  }
})