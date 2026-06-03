import {
  type Location,
  type InsertLocation,
  locations,
  rooms,
  teachers,
  schedule,
} from "@shared/schema";
import { db } from "@db";
import { eq, and, lte, gte } from "drizzle-orm";

export interface IStorage {
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | undefined>;
  getLocationsByFloor(floor: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;

  getCurrentLesson(
      roomNumber: string,
      dayOfWeek: number,
      currentTime: string,
  ): Promise<{ subject: string; teacher: string } | null>;
}

export class DbStorage implements IStorage {
  async getAllLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    const result = await db
        .select()
        .from(locations)
        .where(eq(locations.id, id));
    return result[0];
  }

  async getLocationsByFloor(floor: string): Promise<Location[]> {
    return await db
        .select()
        .from(locations)
        .where(eq(locations.floor, floor));
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const result = await db
        .insert(locations)
        .values(insertLocation)
        .returning();
    return result[0];
  }

  async getCurrentLesson(
      roomNumber: string,
      dayOfWeek: number,
      currentTime: string,
  ): Promise<{ subject: string; teacher: string } | null> {
    const result = await db
        .select({
          subject: schedule.subject,
          teacher: teachers.name,
          // startTime: schedule.startTime,
          // endTime: schedule.endTime,
        })
        .from(schedule)
        .innerJoin(rooms, eq(schedule.roomId, rooms.id))
        .innerJoin(teachers, eq(schedule.teacherId, teachers.id))
        .where(
            and(
                eq(rooms.roomNumber, roomNumber),
                eq(schedule.dayOfWeek, dayOfWeek),
                lte(schedule.startTime, currentTime),
                gte(schedule.endTime, currentTime),
            ),
        )
        .limit(1);

    if (result.length === 0) return null;
    return result[0];
  }
}

export const storage = new DbStorage();
