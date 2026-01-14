import path from "node:path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";

import { db } from "@db";
import { rooms, teachers, schedule } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XLSX_PATH = path.resolve(__dirname, "data", "Harok1.xlsx");

const META_SHEETS = new Set<string>([
    "Voľní učitelia 2",
    "Voľní učitelia",
    "Legenda učiteľov",
    "Voľné učebne",
    "Hodiny",
    "Triedy",
    "Učebne",
    "Predmety",
    "Učitelia",
    "Úväzky Triedy",
    "Úväzok",
]);

const DAY_MAP: Record<string, number> = {
    Pondelok: 1,
    Utorok: 2,
    Streda: 3,
    Štvrtok: 4,
    Piatok: 5,
    Sobota: 6,
    Nedeľa: 7,
};

// You can change time here
const HOUR_TIMES: Record<number, { start: string; end: string }> = {
    1: { start: "07:10", end: "07:55" },
    2: { start: "08:00", end: "08:45" },
    3: { start: "08:55", end: "09:40" },
    4: { start: "09:50", end: "10:35" },
    5: { start: "10:45", end: "11:30" },
    6: { start: "11:40", end: "12:25" },
    7: { start: "12:35", end: "13:20" },
    8: { start: "13:25", end: "14:10" },
    9: { start: "14:15", end: "15:00" },
    10: { start: "15:05", end: "15:50" },
    11: { start: "15:55", end: "16:40" },
    12: { start: "16:45", end: "17:30" },
    13: { start: "17:35", end: "18:20" },
};

async function main() {
    console.log("Loading workbook:", XLSX_PATH);
    const workbook = xlsx.readFile(XLSX_PATH);

    const subjectNameToCode = new Map<string, string>();
    {
        const sheet = workbook.Sheets["Predmety"];
        if (!sheet) throw new Error("Sheet 'Predmety' not found");

        const rows: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            raw: false,
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const name = row[1]?.toString().trim();
            const code = row[2]?.toString().trim();
            if (!name || !code) continue;
            subjectNameToCode.set(name, code);
        }
    }

    const classToRoom = new Map<string, string>();

    const roomShortToId = new Map<string, number>();

    {
        const sheet = workbook.Sheets["Učebne"];
        if (!sheet) throw new Error("Sheet 'Učebne' not found");

        const rows: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            raw: false,
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const roomShort = row[2]?.toString().trim();
            const homeFor = row[4]?.toString().trim();

            if (!roomShort) continue;

            let roomId = roomShortToId.get(roomShort);
            if (!roomId) {
                const inserted = await db
                    .insert(rooms)
                    .values({ roomNumber: roomShort })
                    .onConflictDoNothing()
                    .returning();

                if (inserted.length > 0) {
                    roomId = inserted[0].id;
                } else {
                    const existing = await db
                        .select()
                        .from(rooms)
                        .where(eq(rooms.roomNumber, roomShort));
                    if (!existing[0]) {
                        throw new Error(`Room not found after insert: ${roomShort}`);
                    }
                    roomId = existing[0].id;
                }

                roomShortToId.set(roomShort, roomId);
            }

            if (homeFor) {
                for (const part of homeFor.split(",")) {
                    const cls = part.trim();
                    if (!cls) continue;
                    if (!classToRoom.has(cls)) {
                        classToRoom.set(cls, roomShort);
                    }
                }
            }
        }
    }

    const teacherNameToId = new Map<string, number>();

    {
        const sheet = workbook.Sheets["Učitelia"];
        if (!sheet) throw new Error("Sheet 'Učitelia' not found");

        const rows: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            raw: false,
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const name = row[1]?.toString().trim();
            if (!name) continue;

            let teacherId = teacherNameToId.get(name);
            if (!teacherId) {
                const inserted = await db
                    .insert(teachers)
                    .values({ name })
                    .onConflictDoNothing()
                    .returning();

                if (inserted.length > 0) {
                    teacherId = inserted[0].id;
                } else {
                    const existing = await db
                        .select()
                        .from(teachers)
                        .where(eq(teachers.name, name));
                    if (!existing[0]) {
                        throw new Error(`Teacher not found after insert: ${name}`);
                    }
                    teacherId = existing[0].id;
                }

                teacherNameToId.set(name, teacherId);
            }
        }
    }

    const teacherByClassAndSubjectCode = new Map<string, string>();

    {
        const sheet = workbook.Sheets["Hodiny"];
        if (!sheet) throw new Error("Sheet 'Hodiny' not found");

        const rows: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            raw: false,
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const teacherName = row[0]?.toString().trim();
            const className = row[1]?.toString().trim();
            const subjectCode = row[3]?.toString().trim();

            if (!teacherName || !className || !subjectCode) continue;

            const key = `${className}|${subjectCode}`;
            teacherByClassAndSubjectCode.set(key, teacherName);
        }
    }

    const seenScheduleKeys = new Set<string>();

    for (const sheetName of workbook.SheetNames) {
        if (META_SHEETS.has(sheetName)) continue;

        const subjectName = sheetName.replace(/\.+$/, "").trim();
        const subjectCode = subjectNameToCode.get(subjectName);
        if (!subjectCode) {
            continue;
        }

        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            raw: false,
        });

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const dayRaw = row[1]?.toString().trim();
            const hourRaw = row[2]?.toString().trim();

            if (!dayRaw || dayRaw === "Deň" || !hourRaw) continue;

            const dayOfWeek = DAY_MAP[dayRaw];
            if (!dayOfWeek) continue;

            const hourNumber = Number(hourRaw);
            if (!Number.isFinite(hourNumber)) continue;

            const timeInfo = HOUR_TIMES[hourNumber];
            if (!timeInfo) continue;

            for (let col = 3; col < row.length; col++) {
                const cell = row[col];
                if (!cell) continue;

                const cellStr = cell.toString().trim();
                if (!cellStr) continue;

                const classNames = cellStr.split(",").map((s: string) => s.trim()).filter(Boolean);

                for (const className of classNames) {
                    const teacherName = teacherByClassAndSubjectCode.get(`${className}|${subjectCode}`);
                    if (!teacherName) {
                        console.warn(
                            `No teacher for combination: class=${className}, subject=${subjectCode} (sheet ${sheetName})`,
                        );
                        continue;
                    }

                    const teacherId = teacherNameToId.get(teacherName);
                    if (!teacherId) {
                        console.warn(`Teacher not found in DB: ${teacherName}`);
                        continue;
                    }

                    const roomShort = classToRoom.get(className);
                    if (!roomShort) {
                        console.warn(`No home room for class ${className}, using null room`);
                        continue;
                    }

                    const roomId = roomShortToId.get(roomShort);
                    if (!roomId) {
                        console.warn(`Room not found in DB for ${roomShort}`);
                        continue;
                    }

                    const key = [
                        className,
                        subjectCode,
                        dayOfWeek,
                        hourNumber,
                        teacherId,
                        roomId,
                    ].join("|");

                    if (seenScheduleKeys.has(key)) continue;
                    seenScheduleKeys.add(key);

                    await db.insert(schedule).values({
                        roomId,
                        subject: subjectCode,
                        teacherId,
                        dayOfWeek,
                        startTime: timeInfo.start,
                        endTime: timeInfo.end,
                    });
                }
            }
        }
    }

    console.log("Import finished");
}

main()
    .then(() => {
        console.log("Done.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Import failed:", err);
        process.exit(1);
    });
