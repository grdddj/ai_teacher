import { supabase } from '../database'
import type { HelloResponse } from '../../types/api'

export default defineEventHandler(async (_event): Promise<HelloResponse> => {
  try {
    const { count } = await supabase.from('groups').select('*', { count: 'exact', head: true })

    return {
      message: 'Hello World from API with Database!',
      database_status: 'connected',
      groups_count: count || 0,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Database connection error:', error)
    return {
      message: 'Hello World from API (Database offline)',
      database_status: 'error',
      groups_count: 0,
      timestamp: new Date().toISOString(),
      error: error.message,
    }
  }
})
