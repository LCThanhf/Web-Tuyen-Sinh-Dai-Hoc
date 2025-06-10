import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { cccd: '999999999' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123456', 12);
    
    const admin = await prisma.user.create({
      data: {
        cccd: '999999999',
        fullName: 'Admin Hệ thống Tuyển sinh',
        email: 'admin@tuyensinh.edu.vn',
        phone: '0999999999',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });

    console.log('Admin user created successfully:', {
      cccd: admin.cccd,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();