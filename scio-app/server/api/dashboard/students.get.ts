import { supabase } from '../../database'

export interface StudentProgress {
  deviceId: string
  nickname: string | null
  groupId: string
  groupName: string
  messageCount: number
  lastMessageAt: string | null
  currentCompletion: number
  lastActivity: string
}

export interface DashboardData {
  students: StudentProgress[]
  totalStudents: number
  activeGroups: number
}

export default defineEventHandler(async (): Promise<DashboardData> => {
  try {
    // Get all group members with their device and group information
    const { data: memberships, error: membershipsError } = await supabase
      .from('group_members')
      .select(
        `
        device_id,
        group_id,
        joined_at,
        devices!inner(id, nickname),
        groups!inner(id, name, description)
      `
      )
      .order('joined_at', { ascending: false })

    if (membershipsError) {
      throw membershipsError
    }

    if (!memberships || memberships.length === 0) {
      return {
        students: [],
        totalStudents: 0,
        activeGroups: 0,
      }
    }

    // Get message counts and completion data for each device in each group
    const studentProgress: StudentProgress[] = []
    const groupIds = new Set<string>()

    for (const membership of memberships) {
      const deviceId = membership.device_id
      const groupId = membership.group_id

      // Get message count and last message for this device in this group
      const { data: messageStats, error: messageStatsError } = await supabase
        .from('group_messages')
        .select('id, created_at, source, completion')
        .eq('device_id', deviceId)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })

      if (messageStatsError) {
        console.error('Error fetching message stats:', messageStatsError)
        continue
      }

      // Find the latest completion percentage from system messages
      const systemMessages =
        messageStats?.filter((msg) => msg.source === 'system' && msg.completion !== null) || []
      const latestCompletion = systemMessages.length > 0 ? systemMessages[0].completion : 0

      // Count only user messages
      const userMessages = messageStats?.filter((msg) => msg.source === 'user') || []
      const messageCount = userMessages.length

      // Get last message timestamp (any message type)
      const lastMessageAt =
        messageStats && messageStats.length > 0 ? messageStats[0].created_at : null

      studentProgress.push({
        deviceId,
        nickname: membership.devices.nickname,
        groupId,
        groupName: membership.groups.name,
        messageCount,
        lastMessageAt,
        currentCompletion: latestCompletion || 0,
        lastActivity: lastMessageAt || membership.joined_at,
      })

      groupIds.add(groupId)
    }

    // Sort by last activity (most recent first)
    studentProgress.sort(
      (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    )

    return {
      students: studentProgress,
      totalStudents: studentProgress.length,
      activeGroups: groupIds.size,
    }
  } catch (error: any) {
    console.error('Dashboard error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard data',
      data: error.message,
    })
  }
})
