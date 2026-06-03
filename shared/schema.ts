import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  roomNumber: text("room_number").notNull(),
  floor: text("floor").notNull(),
  type: text("type").notNull(),
  description: text("description"),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export const rooms = pgTable("rooms", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  roomNumber: text("room_number").notNull().unique(),
});

export const teachers = pgTable("teachers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export const schedule = pgTable("schedule", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id),
  subject: text("subject").notNull(),
  teacherId: integer("teacher_id")
      .notNull()
      .references(() => teachers.id),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type ScheduleEntry = typeof schedule.$inferSelect;
