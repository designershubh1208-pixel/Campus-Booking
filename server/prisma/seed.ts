import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resourcesData = [
  // Rooms
  { name: 'Study Room', category: 'Rooms', location: 'Library 1st Floor' },
  { name: 'Group Discussion Room', category: 'Rooms', location: 'Student Center' },
  { name: 'Silent Study Cabin', category: 'Rooms', location: 'Library 3rd Floor' },
  { name: 'Conference Room', category: 'Rooms', location: 'Main Admin Block' },
  { name: 'Seminar Hall', category: 'Rooms', location: 'Block A, Ground Floor' },
  { name: 'Interview Room', category: 'Rooms', location: 'Career Services Center' },
  { name: 'Meeting Room', category: 'Rooms', location: 'Innovation Hub' },

  // Labs
  { name: 'Computer Lab Workstation', category: 'Labs', location: 'Computer Science Dept' },
  { name: 'Robotics Lab Bench', category: 'Labs', location: 'Engineering Block' },
  { name: 'Electronics Lab Bench', category: 'Labs', location: 'Engineering Block' },
  { name: 'Media Lab Workstation', category: 'Labs', location: 'Arts & Media Dept' },

  // Studios
  { name: 'Podcast Studio', category: 'Studios', location: 'Media Center' },
  { name: 'Photography Studio', category: 'Studios', location: 'Arts & Media Dept' },
  { name: 'Recording Room', category: 'Studios', location: 'Music Building' },
  { name: 'Green Screen Studio', category: 'Studios', location: 'Media Center' },
  { name: 'Music Practice Room', category: 'Studios', location: 'Music Building' },

  // Equipment
  { name: '3D Printer', category: 'Equipment', location: 'Makerspace' },
  { name: 'Laser Cutter', category: 'Equipment', location: 'Makerspace' },
  { name: 'DSLR Camera', category: 'Equipment', location: 'Equipment Room 1' },
  { name: 'Video Camera', category: 'Equipment', location: 'Equipment Room 1' },
  { name: 'Tripod', category: 'Equipment', location: 'Equipment Room 1' },
  { name: 'Microphone Kit', category: 'Equipment', location: 'Equipment Room 2' },
  { name: 'Audio Recorder', category: 'Equipment', location: 'Equipment Room 2' },
  { name: 'Lighting Kit', category: 'Equipment', location: 'Equipment Room 1' },
  { name: 'Projector', category: 'Equipment', location: 'IT Services' },
  { name: 'Laptop', category: 'Equipment', location: 'IT Services' },

  // Kits
  { name: 'Arduino Kit', category: 'Kits', location: 'Electronics Lab' },
  { name: 'Raspberry Pi Kit', category: 'Kits', location: 'Computer Science Dept' },
  { name: 'VR Headset', category: 'Kits', location: 'Innovation Hub' },
  { name: 'Soldering Station', category: 'Kits', location: 'Makerspace' },

  // Sports
  { name: 'Badminton Court', category: 'Sports', location: 'Indoor Sports Complex' },
  { name: 'Basketball Court', category: 'Sports', location: 'Outdoor Courts' },
  { name: 'Table Tennis Table', category: 'Sports', location: 'Student Center Recreation' },
  { name: 'Football Field Slot', category: 'Sports', location: 'Main Stadium' },
];

async function main() {
  console.log('Start seeding...');
  
  for (const r of resourcesData) {
    const existingResource = await prisma.resource.findFirst({
      where: { name: r.name }
    });
    
    if (!existingResource) {
      await prisma.resource.create({
        data: {
          name: r.name,
          description: `A standard ${r.name.toLowerCase()} available for student booking.`,
          location: r.location,
          category: r.category
        }
      });
      console.log(`Created resource: ${r.name}`);
    } else {
      console.log(`Resource already exists: ${r.name}`);
    }
  }
  
  console.log('Seeding finished.');
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
