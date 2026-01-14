import "dotenv/config";
import { db } from "@db";
import { locations, rooms } from "@shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding locations from rooms...");

    const allRooms = await db.select().from(rooms);
    console.log(`Found ${allRooms.length} rooms in database`);

    let created = 0;
    let skipped = 0;

    for (const room of allRooms) {
        const roomNumber = room.roomNumber;

        const existing = await db
            .select()
            .from(locations)
            .where(eq(locations.roomNumber, roomNumber));

        if (existing.length > 0) {
            skipped++;
            continue;
        }

        const floor = detectFloor(roomNumber);

        const type = "classroom";

        const description = `Učebňa ${roomNumber}`;

        await db.insert(locations).values({
            name: `Učebňa ${roomNumber}`,
            roomNumber,
            floor,
            type,
            description,
            x: null,
            y: null,
            width: null,
            height: null,
        } as any);

        created++;
    }

    console.log(`Done. Created ${created} locations, skipped ${skipped} existing.`);
    process.exit(0);
}

function detectFloor(roomNumber: string): string {

    const lower = roomNumber.toLowerCase();

    if (lower.startsWith("d")) {
        return "Prízemie";
    }

    if (lower.startsWith("u1")) {
        return "1. poschodie";
    }
    if (lower.startsWith("u2")) {
        return "2. poschodie";
    }
    if (lower.startsWith("u3")) {
        return "3. poschodie";
    }
    if (lower.startsWith("u4")) {
        return "4. poschodie";
    }

    const numericMatch = roomNumber.match(/^(\d)/);
    if (numericMatch) {
        const firstDigit = numericMatch[1];
        switch (firstDigit) {
            case "0":
            case "1":
                return "1. poschodie";
            case "2":
                return "2. poschodie";
            case "3":
                return "3. poschodie";
            case "4":
                return "4. poschodie";
        }
    }

    return "Prízemie";
}

main().catch((err) => {
    console.error("Error seeding locations from rooms:", err);
    process.exit(1);
});
