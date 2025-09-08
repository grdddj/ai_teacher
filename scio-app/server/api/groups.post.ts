import { supabase } from '../database'
import type { CreateGroupRequest, CreateGroupResponse } from '../../types/api'

export default defineEventHandler(async (event): Promise<CreateGroupResponse> => {
  try {
    const body = await readBody<CreateGroupRequest>(event)

    // Basic validation
    if (!body.owner_id || !body.name || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: owner_id, name, description',
      })
    }

    const { data: newGroup, error } = await supabase
      .from('groups')
      .insert({
        owner_id: body.owner_id,
        name: body.name,
        description: body.description,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      group: newGroup,
      message: 'Group created successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Database error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create group',
      data: error.message,
    })
  }
})
