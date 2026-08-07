import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getCapacityForCategory(category: string): number {
  if (category === 'Equipment' || category === 'Kits') return 5;
  return 1;
}

async function main() {
  console.log('Start seeding slots...');
  
  const resources = await prisma.resource.findMany();
  
  if (resources.length === 0) {
    console.log('No resources found. Please run the resource seed script first.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate slots for the next 7 days
  for (let i = 0; i < 7; i++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + i);

    // 4 time slots per day: 09:00-11:00, 11:00-13:00, 14:00-16:00, 16:00-18:00
    const timeRanges = [
      { start: 9, end: 11 },
      { start: 11, end: 13 },
      { start: 14, end: 16 },
      { start: 16, end: 18 }
    ];

    for (const range of timeRanges) {
      const startTime = new Date(slotDate);
      startTime.setHours(range.start, 0, 0, 0);

      const endTime = new Date(slotDate);
      endTime.setHours(range.end, 0, 0, 0);

      for (const resource of resources) {
        // Check if slot already exists for this resource and time
        const existingSlot = await prisma.slot.findFirst({
          where: {
            resourceId: resource.id,
            date: slotDate,
            startTime: startTime,
          }
        });

        if (!existingSlot) {
          await prisma.slot.create({
            data: {
              resourceId: resource.id,
              date: slotDate,
              startTime: startTime,
              endTime: endTime,
              capacity: getCapacityForCategory(resource.category)
            }
          });
        }
      }
    }
  }

  console.log('Successfully seeded time slots for all resources!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
