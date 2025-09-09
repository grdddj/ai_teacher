import { supabase } from '../../../../database'
import { MessageSource } from '../../../../../types/api'
import type { Message } from '../../../../../types/api'

export interface DetailedMessage extends Message {
  contributedToGoal?: boolean
}

export interface StudentDetail {
  deviceId: string
  groupId: string
  nickname: string | null
  groupName: string
  groupDescription: string
  messages: DetailedMessage[]
  totalMessages: number
  currentCompletion: number
  joinedAt: string
  helpfulMessageIds: string[]
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

    // Identify helpful messages that contributed to progress
    const helpfulMessageIds = new Set<string>()
    let lastCompletion = 0

    // Sort messages chronologically to analyze progression
    const sortedMessages = (messages || []).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    for (let i = 0; i < sortedMessages.length; i++) {
      const message = sortedMessages[i]

      // Check if this is a system message with completion data
      if (message.source === 'system' && message.completion !== null) {
        const currentCompletion = message.completion

        // If completion increased, mark the previous user message(s) as helpful
        if (currentCompletion > lastCompletion) {
          // Look backwards for recent user messages that might have contributed
          for (let j = i - 1; j >= 0; j--) {
            const prevMessage = sortedMessages[j]

            // Stop at the previous system message with completion
            if (prevMessage.source === 'system' && prevMessage.completion !== null) {
              break
            }

            // Mark user messages as helpful
            if (prevMessage.source === 'user') {
              helpfulMessageIds.add(prevMessage.id)
            }
          }
        }

        lastCompletion = currentCompletion
      }
    }

    // Format messages with helpful flag
    const formattedMessages: DetailedMessage[] = (messages || []).map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.created_at,
      source: msg.source === 'system' ? MessageSource.System : MessageSource.User,
      completion: msg.completion,
      contributedToGoal: helpfulMessageIds.has(msg.id),
    }))

    return {
      deviceId,
      groupId,
      nickname: (membership.devices as any).nickname,
      groupName: (membership.groups as any).name,
      groupDescription: (membership.groups as any).description,
      messages: formattedMessages,
      totalMessages: formattedMessages.filter((msg) => msg.source === MessageSource.User).length,
      currentCompletion: latestCompletion || 0,
      joinedAt: membership.joined_at,
      helpfulMessageIds: Array.from(helpfulMessageIds),
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
