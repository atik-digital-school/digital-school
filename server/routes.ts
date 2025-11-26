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
