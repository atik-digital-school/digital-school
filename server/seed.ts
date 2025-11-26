import { db } from "@db";
import { locations } from "@shared/schema";

const seedLocations = [
  { name: 'Učebňa 5', roomNumber: '5', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 6', roomNumber: '6', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 7', roomNumber: '7', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 8', roomNumber: '8', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 9', roomNumber: '9', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 10', roomNumber: '10', floor: 'Prízemie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 11', roomNumber: '11', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 12', roomNumber: '12', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 13', roomNumber: '13', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 14', roomNumber: '14', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 15', roomNumber: '15', floor: '1. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 16', roomNumber: '16', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 17', roomNumber: '17', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 18', roomNumber: '18', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 19', roomNumber: '19', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 20', roomNumber: '20', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 21', roomNumber: '21', floor: '2. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 22', roomNumber: '22', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 23', roomNumber: '23', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 24', roomNumber: '24', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 25', roomNumber: '25', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 26', roomNumber: '26', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 27', roomNumber: '27', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 28', roomNumber: '28', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 29', roomNumber: '29', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Učebňa 30', roomNumber: '30', floor: '3. poschodie', type: 'classroom', description: 'Trieda' },
  { name: 'Riaditeľstvo', roomNumber: '401', floor: '4. poschodie', type: 'office', description: 'Školská administratíva a vedenie školy' },
  { name: 'Sekretariát', roomNumber: '402', floor: '4. poschodie', type: 'office', description: 'Administratívne služby' },
  { name: 'Zborovňa', roomNumber: '403', floor: '4. poschodie', type: 'office', description: 'Miestnosť pre učiteľov' },
];

async function seed() {
  console.log('Seeding database...');
  
  const existing = await db.select().from(locations);
  if (existing.length > 0) {
    console.log('Database already seeded. Skipping...');
    return;
  }

  await db.insert(locations).values(seedLocations);
  console.log('Database seeded successfully!');
}

seed().catch(console.error);
