import { supabase } from '../../database'
import type { SendMessageRequest, SendMessageResponse, Message } from '../../../types/api'
import { MessageSource } from '../../../types/api'
import { analyzeGoalCompletion } from '../../utils/analyzeGoalCompletion'

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

    // Insert the user message
    const { data: newMessage, error: insertError } = await supabase
      .from('group_messages')
      .insert({
        group_id: groupId,
        device_id: deviceId,
        content: trimmedContent,
        source: 'user',
        completion: null,
      })
      .select('id, content, created_at, source, completion')
      .single()

    if (insertError) {
      throw insertError
    }

    const messages: Message[] = [
      {
        id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.created_at,
        source: MessageSource.User,
      },
    ]

    // Get group details for goal description
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('description')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      console.error('Failed to get group details:', groupError)
      // Return just the user message if we can't get the group
      return {
        success: true,
        messages,
        timestamp: new Date().toISOString(),
      }
    }

    // Get all messages for this group to analyze progress
    const { data: allMessages, error: messagesError } = await supabase
      .from('group_messages')
      .select('content, created_at, device_id')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Failed to get messages:', messagesError)
      // Return just the user message if we can't get messages
      return {
        success: true,
        messages,
        timestamp: new Date().toISOString(),
      }
    }

    try {
      // Get device nicknames for messages
      const deviceIds = [...new Set(allMessages.map((m) => m.device_id))]
      const { data: devices } = await supabase
        .from('devices')
        .select('id, nickname')
        .in('id', deviceIds)

      const deviceMap = new Map(devices?.map((d) => [d.id, d.nickname]) || [])

      // Format messages for analysis
      const formattedMessages = [
        {
          role: 'system' as const,
          content: `Welcome! Your goal: ${group.description}`,
          timestamp: new Date(),
        },
        ...allMessages
          .filter((m) => m.device_id)
          .map((m) => ({
            role: 'user' as const,
            content: `${deviceMap.get(m.device_id) || 'Unknown'}: ${m.content}`,
            timestamp: new Date(m.created_at),
          })),
      ]

      // Analyze goal completion
      const analysisResult = await analyzeGoalCompletion(group.description, formattedMessages)

      // Create system message with evaluation
      const evaluationContent = analysisResult.text
      const { data: evalMessage, error: evalError } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          device_id: deviceId, // Use the same device_id for now, or could be null
          content: evaluationContent,
          source: 'system',
          completion: analysisResult.completion,
        })
        .select('id, content, created_at, source, completion')
        .single()

      if (evalError) {
        console.error('Failed to save evaluation message:', evalError)
      } else {
        messages.push({
          id: evalMessage.id,
          content: evalMessage.content,
          createdAt: evalMessage.created_at,
          source: MessageSource.System,
          completion: evalMessage.completion,
          goals: analysisResult.goals,
        })
      }
    } catch (analysisError) {
      console.error('Goal analysis failed:', analysisError)
      // Continue without evaluation if analysis fails
    }

    // Return response with all messages
    return {
      success: true,
      messages,
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
