import { supabase } from '../../../../database'
import { MessageSource } from '../../../../../types/api'
import type { Message } from '../../../../../types/api'

export interface StudentDetail {
  deviceId: string
  groupId: string
  nickname: string | null
  groupName: string
  groupDescription: string
  messages: Message[]
  totalMessages: number
  currentCompletion: number
  joinedAt: string
}

export default defineEventHandler(async (event): Promise<StudentDetail> => {
  try {
    const deviceId = getRouterParam(event, 'deviceId')
    const groupId = getRouterParam(event, 'groupId')

    if (!deviceId || !groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing deviceId or groupId parameter',
      })
    }

    // Get device and group information
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select(
        `
        joined_at,
        devices!inner(id, nickname),
        groups!inner(id, name, description)
      `
      )
      .eq('device_id', deviceId)
      .eq('group_id', groupId)
      .single()

    if (membershipError || !membership) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found in group',
      })
    }

    // Get all messages for this device in this group
    const { data: messages, error: messagesError } = await supabase
      .from('group_messages')
      .select('id, content, created_at, source, completion')
      .eq('device_id', deviceId)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw messagesError
    }

    // Find the latest completion percentage
    const systemMessages =
      messages?.filter((msg) => msg.source === 'system' && msg.completion !== null) || []
    const latestCompletion =
      systemMessages.length > 0 ? systemMessages[systemMessages.length - 1].completion : 0

    // Format messages
    const formattedMessages: Message[] = (messages || []).map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.created_at,
      source: msg.source === 'system' ? MessageSource.System : MessageSource.User,
      completion: msg.completion,
    }))

    return {
      deviceId,
      groupId,
      nickname: membership.devices.nickname,
      groupName: membership.groups.name,
      groupDescription: membership.groups.description,
      messages: formattedMessages,
      totalMessages: formattedMessages.filter((msg) => msg.source === MessageSource.User).length,
      currentCompletion: latestCompletion || 0,
      joinedAt: membership.joined_at,
    }
  } catch (error: any) {
    console.error('Student detail error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student details',
      data: error.message,
    })
  }
})
