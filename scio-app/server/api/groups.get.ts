import { supabase } from '../database'
import type { GroupsResponse } from '../../types/api'

export default defineEventHandler(async (_event): Promise<GroupsResponse> => {
  try {
    const { data: groups, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      groups: groups || [],
      count: groups?.length || 0,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Database error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch groups from database',
      data: error.message,
    })
  }
})
