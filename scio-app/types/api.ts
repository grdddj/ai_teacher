// API Response Types
export interface Group {
  id: string
  owner_id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface GroupsResponse {
  success: boolean
  groups: Group[]
  count: number
  timestamp: string
}

export interface HelloResponse {
  message: string
  database_status: string
  groups_count: number
  timestamp: string
  error?: string
}

export interface CreateGroupRequest {
  owner_id: string
  name: string
  description: string
}

export interface CreateGroupResponse {
  success: boolean
  group: Group
  message: string
  timestamp: string
}

export enum MessageSource {
  User = 'user',
  System = 'system',
}

export interface Message {
  id: string
  content: string
  createdAt: string
  source: MessageSource
}

export interface JoinGroupRequest {
  groupId: string
  deviceId?: string
  nickname?: string
}

export interface JoinGroupResponse {
  success: boolean
  deviceId: string
  deviceNickname: string | null
  group: {
    id: string
    name: string
    description: string
  }
  messages: Message[]
  timestamp: string
}

export interface UpdateNicknameRequest {
  deviceId: string
  nickname: string
}

export interface UpdateNicknameResponse {
  success: boolean
  deviceId: string
  nickname: string
  timestamp: string
}
