import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedTestStudents() {
  try {
    console.log('🌱 Seeding test student users...');    // Check if test students already exist
    const existingStudent = await prisma.user.findFirst({
      where: { 
        cccd: '123456789012'
      }
    });

    if (existingStudent) {
      console.log('Test student users already exist');
      console.log('Available test student credentials:');
      console.log('- CCCD: 123456789012, Password: Student123456');
      console.log('- CCCD: 234567890123, Password: Student123456');
      console.log('- CCCD: 345678901234, Password: Student123456');
      return;
    }

    // Create test student users
    const hashedPassword = await bcrypt.hash('Student123456', 12);
    
    // Student 1
    const student1 = await prisma.user.create({
      data: {
        cccd: '123456789012',
        fullName: 'Nguyễn Văn An',
        email: 'nguyenvanan@example.com',
        phone: '0912345678',
        password: hashedPassword,
        role: 'STUDENT'
      }
    });

    await prisma.student.create({
      data: {
        userId: student1.id,
        dob: new Date('2006-01-15'),
        gender: 'MALE',
        cccdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
        cccdIssueDate: new Date('2024-01-01'),
        address: '123 Lê Lợi, Quận Hoàn Kiếm, Hà Nội',
        city: 'Hà Nội',
        district: 'Hoàn Kiếm',
        highSchoolName: 'THPT Chu Văn An',
        graduationYear: 2024
      }
    });

    // Student 2
    const student2 = await prisma.user.create({
      data: {
        cccd: '234567890123',
        fullName: 'Trần Thị Bình',
        email: 'tranthibinh@example.com',
        phone: '0923456789',
        password: hashedPassword,
        role: 'STUDENT'
      }
    });

    await prisma.student.create({
      data: {
        userId: student2.id,
        dob: new Date('2006-03-20'),
        gender: 'FEMALE',
        cccdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
        cccdIssueDate: new Date('2024-01-01'),
        address: '456 Trần Hưng Đạo, Quận 5, TP.HCM',
        city: 'TP.HCM',
        district: 'Quận 5',
        highSchoolName: 'THPT Nguyễn Du',
        graduationYear: 2024
      }
    });

    // Student 3
    const student3 = await prisma.user.create({
      data: {
        cccd: '345678901234',
        fullName: 'Lê Minh Chính',
        email: 'leminhchinh@example.com',
        phone: '0934567890',
        password: hashedPassword,
        role: 'STUDENT'
      }
    });

    await prisma.student.create({
      data: {
        userId: student3.id,
        dob: new Date('2006-07-10'),
        gender: 'MALE',
        cccdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
        cccdIssueDate: new Date('2024-01-01'),
        address: '789 Nguyễn Huệ, Quận 1, TP.HCM',
        city: 'TP.HCM',
        district: 'Quận 1',
        highSchoolName: 'THPT Lê Quý Đôn',
        graduationYear: 2024
      }
    });

    console.log('✅ Test student users created successfully:');
    console.log('- Student 1: CCCD 123456789012, Password: Student123456');
    console.log('- Student 2: CCCD 234567890123, Password: Student123456');
    console.log('- Student 3: CCCD 345678901234, Password: Student123456');

  } catch (error) {
    console.error('❌ Error creating test student users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedTestStudents()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedTestStudents };
