import { supabase } from '../../database'
import type { JoinGroupRequest, JoinGroupResponse } from '../../../types/api'
import { MessageSource } from '../../../types/api'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event): Promise<JoinGroupResponse> => {
  try {
    const body = await readBody<JoinGroupRequest>(event)

    // Basic validation
    if (!body.groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required field: groupId',
      })
    }

    const { groupId, deviceId, nickname } = body

    // Check if group exists
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, description')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found',
      })
    }

    let finalDeviceId = deviceId

    // If deviceId is not provided, create a new device
    if (!finalDeviceId) {
      finalDeviceId = randomUUID()

      const { error: deviceError } = await supabase
        .from('devices')
        .insert({
          id: finalDeviceId,
          nickname: nickname || null, // Allow null nickname
        })
        .select('id')
        .single()

      if (deviceError) {
        throw deviceError
      }
    } else {
      // Check if device exists
      const { data: existingDevice, error: deviceCheckError } = await supabase
        .from('devices')
        .select('id, nickname')
        .eq('id', finalDeviceId)
        .single()

      if (deviceCheckError && deviceCheckError.code === 'PGRST116') {
        // Device doesn't exist, create it
        const { error: createError } = await supabase.from('devices').insert({
          id: finalDeviceId,
          nickname: nickname || null, // Allow null nickname
        })

        if (createError) {
          throw createError
        }
      } else if (!deviceCheckError && nickname && nickname !== existingDevice.nickname) {
        // Device exists and nickname is provided and different, update it
        const { error: updateError } = await supabase
          .from('devices')
          .update({ nickname })
          .eq('id', finalDeviceId)

        if (updateError) {
          throw updateError
        }
      } else if (deviceCheckError) {
        throw deviceCheckError
      }
    }

    // Check if device is already a member of this group
    const { error: membershipError } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('device_id', finalDeviceId)
      .single()

    // If not a member, add to group and create welcome message
    if (membershipError && membershipError.code === 'PGRST116') {
      const { error: joinError } = await supabase.from('group_members').insert({
        group_id: groupId,
        device_id: finalDeviceId,
      })

      if (joinError) {
        throw joinError
      }
    } else if (membershipError) {
      throw membershipError
    }

    // Get messages for this group and device
    const { data: messages, error: messagesError } = await supabase
      .from('group_messages')
      .select('id, content, created_at, source, completion')
      .eq('group_id', groupId)
      .eq('device_id', finalDeviceId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw messagesError
    }

    // Get the device info to include current nickname
    const { data: deviceInfo, error: deviceInfoError } = await supabase
      .from('devices')
      .select('nickname')
      .eq('id', finalDeviceId)
      .single()

    if (deviceInfoError) {
      throw deviceInfoError
    }

    // Return response
    return {
      success: true,
      deviceId: finalDeviceId,
      deviceNickname: deviceInfo.nickname,
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
      },
      messages: [
        // Add first message with group description (system message)
        {
          id: 'welcome-' + Math.random().toString(36).substring(2, 11),
          content: group.description,
          createdAt: new Date().toISOString(),
          source: MessageSource.System,
        },
        // Add all messages from the database
        ...(messages || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          createdAt: msg.created_at,
          source: msg.source === 'system' ? MessageSource.System : MessageSource.User,
          completion: msg.completion,
        })),
      ],
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Join group error:', error)

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
