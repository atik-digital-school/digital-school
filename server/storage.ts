import { type Location, type InsertLocation, locations } from "@shared/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | undefined>;
  getLocationsByFloor(floor: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
}

export class DbStorage implements IStorage {
  async getAllLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    const result = await db.select().from(locations).where(eq(locations.id, id));
    return result[0];
  }

  async getLocationsByFloor(floor: string): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.floor, floor));
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const result = await db.insert(locations).values(insertLocation).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
