import { supabase } from '../../database'
import type { SendMessageRequest, SendMessageResponse } from '../../../types/api'
import { MessageSource } from '../../../types/api'

export default defineEventHandler(async (event): Promise<SendMessageResponse> => {
  try {
    const body = await readBody<SendMessageRequest>(event)

    // Basic validation
    if (!body.groupId || !body.deviceId || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: groupId, deviceId, content',
      })
    }

    const { groupId, deviceId, content } = body

    // Trim and validate content
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message content cannot be empty',
      })
    }

    // Verify the device is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('device_id', deviceId)
      .single()

    if (membershipError || !membership) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Device is not a member of this group',
      })
    }

    // Insert the message
    const { data: newMessage, error: insertError } = await supabase
      .from('group_messages')
      .insert({
        group_id: groupId,
        device_id: deviceId,
        content: trimmedContent,
      })
      .select('id, content, created_at')
      .single()

    if (insertError) {
      throw insertError
    }

    // Return response
    return {
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.created_at,
        source: MessageSource.User,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Send message error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: error.message,
    })
  }
})
