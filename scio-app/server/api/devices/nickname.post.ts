import { supabase } from '../../database'
import { broadcastDashboardEvent } from '../../routes/_ws'

interface UpdateNicknameRequest {
  deviceId: string
  nickname: string
}

interface UpdateNicknameResponse {
  success: boolean
  deviceId: string
  nickname: string
  timestamp: string
}

export default defineEventHandler(async (event): Promise<UpdateNicknameResponse> => {
  try {
    const body = await readBody<UpdateNicknameRequest>(event)

    // Basic validation
    if (!body.deviceId || !body.nickname) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: deviceId, nickname',
      })
    }

    const { deviceId, nickname } = body

    // Update the device nickname
    const { error: updateError } = await supabase
      .from('devices')
      .update({ nickname })
      .eq('id', deviceId)

    if (updateError) {
      throw updateError
    }

    // Get all groups this device belongs to for broadcasting
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('device_id', deviceId)

    if (!membershipError && memberships) {
      // Broadcast nickname update for each group the device belongs to
      for (const membership of memberships) {
        try {
          broadcastDashboardEvent({
            type: 'nickname_updated',
            data: {
              deviceId,
              groupId: membership.group_id,
              nickname,
              timestamp: new Date().toISOString(),
            },
          })
        } catch (error) {
          console.error('Failed to broadcast nickname update:', error)
        }
      }
    }

    // Return response
    return {
      success: true,
      deviceId,
      nickname,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Update nickname error:', error)

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
