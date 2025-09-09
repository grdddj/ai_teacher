import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const groups = pgTable('groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  owner_id: varchar('owner_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const devices = pgTable('devices', {
  id: uuid('id').defaultRandom().primaryKey(),
  nickname: varchar('nickname', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const group_members = pgTable('group_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => groups.id),
  device_id: uuid('device_id')
    .notNull()
    .references(() => devices.id),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
})

export const group_messages = pgTable('group_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => groups.id),
  device_id: uuid('device_id')
    .notNull()
    .references(() => devices.id),
  content: text('content').notNull(),
  source: varchar('source', { length: 10 }).notNull().default('user'),
  completion: integer('completion'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export type Group = InferSelectModel<typeof groups>
export type InsertGroup = InferInsertModel<typeof groups>

export type Device = InferSelectModel<typeof devices>
export type InsertDevice = InferInsertModel<typeof devices>

export type GroupMember = InferSelectModel<typeof group_members>
export type InsertGroupMember = InferInsertModel<typeof group_members>

export type GroupMessage = InferSelectModel<typeof group_messages>
export type InsertGroupMessage = InferInsertModel<typeof group_messages>

export const insertGroupSchema = createInsertSchema(groups)
export const selectGroupSchema = createSelectSchema(groups)

export const insertDeviceSchema = createInsertSchema(devices)
export const selectDeviceSchema = createSelectSchema(devices)

export const insertGroupMemberSchema = createInsertSchema(group_members)
export const selectGroupMemberSchema = createSelectSchema(group_members)

export const insertGroupMessageSchema = createInsertSchema(group_messages)
export const selectGroupMessageSchema = createSelectSchema(group_messages)
