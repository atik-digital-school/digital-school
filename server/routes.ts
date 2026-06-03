import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/schedule/current", async (req, res) => {
    try {
      const roomNumber = req.query.room as string | undefined;
      if (!roomNumber) {
        return res.status(400).json({ error: "Missing 'room' query parameter" });
      }

      // необязательные параметры для теста
      const overrideDay = req.query.day as string | undefined;
      const overrideTime = req.query.time as string | undefined;

      let dayOfWeek: number;
      let currentTime: string;

      if (overrideDay) {
        const parsed = Number(overrideDay);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > 7) {
          return res.status(400).json({ error: "Invalid 'day' parameter, expected 1-7" });
        }
        dayOfWeek = parsed;
      } else {
        const now = new Date();
        const jsDay = now.getDay(); // 0–6
        dayOfWeek = jsDay === 0 ? 7 : jsDay;
      }

      if (overrideTime) {
        if (!/^\d{2}:\d{2}$/.test(overrideTime)) {
          return res.status(400).json({ error: "Invalid 'time' parameter, expected HH:MM" });
        }
        currentTime = overrideTime;
      } else {
        const now = new Date();
        currentTime = now.toTimeString().slice(0, 5);
      }

      const lesson = await storage.getCurrentLesson(roomNumber, dayOfWeek, currentTime);

      if (!lesson) {
        return res.status(404).json({ message: "No lesson for this room and time" });
      }

      res.json(lesson);
    } catch (error) {
      console.error("Error fetching current lesson:", error);
      res.status(500).json({ error: "Failed to fetch current lesson" });
    }
  });


  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocationById(req.params.id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  app.get("/api/floors", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      const floors = [...new Set(locations.map(loc => loc.floor))].sort();
      res.json(floors);
    } catch (error) {
      console.error("Error fetching floors:", error);
      res.status(500).json({ error: "Failed to fetch floors" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const newLocation = await storage.createLocation(validatedData);
      res.status(201).json(newLocation);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
