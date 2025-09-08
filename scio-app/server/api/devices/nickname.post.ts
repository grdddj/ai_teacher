import { supabase } from '../../database'

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
