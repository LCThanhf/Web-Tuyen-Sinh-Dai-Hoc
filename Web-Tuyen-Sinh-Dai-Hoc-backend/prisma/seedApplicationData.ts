import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedApplicationData() {
  try {
    console.log('🌱 Seeding application data...');

    // Create Schools
    const schools = await prisma.school.createMany({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Đại học Bách Khoa Hà Nội',
          code: 'HUST',
          totalQuota: 5000,
          isActive: true,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Đại học Kinh tế Quốc dân',
          code: 'NEU',
          totalQuota: 3000,
          isActive: true,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Đại học Quốc gia Hà Nội',
          code: 'VNU',
          totalQuota: 4000,
          isActive: true,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Đại học Y Hà Nội',
          code: 'HMU',
          totalQuota: 1500,
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Schools created');

    // Create Majors for HUST
    const hustMajors = await prisma.major.createMany({
      data: [
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          schoolId: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Công nghệ thông tin',
          code: 'CNTT',
          quota: 500,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440002',
          schoolId: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Điện tử viễn thông',
          code: 'DTVT',
          quota: 400,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440003',
          schoolId: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Cơ khí',
          code: 'CK',
          quota: 600,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440004',
          schoolId: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Kỹ thuật hóa học',
          code: 'KTHH',
          quota: 300,
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    // Create Majors for NEU
    const neuMajors = await prisma.major.createMany({
      data: [
        {
          id: '660e8400-e29b-41d4-a716-446655440005',
          schoolId: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Kinh tế quốc tế',
          code: 'KTQT',
          quota: 200,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440006',
          schoolId: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Quản trị kinh doanh',
          code: 'QTKD',
          quota: 250,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440007',
          schoolId: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Tài chính ngân hàng',
          code: 'TCNH',
          quota: 180,
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    // Create Majors for VNU
    const vnuMajors = await prisma.major.createMany({
      data: [
        {
          id: '660e8400-e29b-41d4-a716-446655440008',
          schoolId: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Ngôn ngữ Anh',
          code: 'NNA',
          quota: 120,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440009',
          schoolId: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Quan hệ quốc tế',
          code: 'QHQT',
          quota: 100,
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    // Create Majors for HMU
    const hmuMajors = await prisma.major.createMany({
      data: [
        {
          id: '660e8400-e29b-41d4-a716-446655440010',
          schoolId: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Y khoa',
          code: 'YK',
          quota: 300,
          isActive: true,
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440011',
          schoolId: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Răng hàm mặt',
          code: 'RHM',
          quota: 100,
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Majors created');

    // Create Admission Combinations
    const combinations = await prisma.admissionCombination.createMany({
      data: [
        {
          id: '770e8400-e29b-41d4-a716-446655440001',
          name: 'A00 - Toán, Lý, Hóa',
          subjects: ['Toán', 'Lý', 'Hóa'],
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          name: 'A01 - Toán, Lý, Anh',
          subjects: ['Toán', 'Lý', 'Anh'],
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440003',
          name: 'D01 - Toán, Văn, Anh',
          subjects: ['Toán', 'Văn', 'Anh'],
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440004',
          name: 'C00 - Văn, Sử, Địa',
          subjects: ['Văn', 'Sử', 'Địa'],
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440005',
          name: 'B00 - Toán, Hóa, Sinh',
          subjects: ['Toán', 'Hóa', 'Sinh'],
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Admission combinations created');

    // Create Major-Combination relationships
    const majorCombinations = await prisma.majorCombination.createMany({
      data: [
        // HUST - CNTT accepts A00, A01, D01
        { majorId: '660e8400-e29b-41d4-a716-446655440001', combinationId: '770e8400-e29b-41d4-a716-446655440001' },
        { majorId: '660e8400-e29b-41d4-a716-446655440001', combinationId: '770e8400-e29b-41d4-a716-446655440002' },
        { majorId: '660e8400-e29b-41d4-a716-446655440001', combinationId: '770e8400-e29b-41d4-a716-446655440003' },
        
        // HUST - DTVT accepts A00, A01
        { majorId: '660e8400-e29b-41d4-a716-446655440002', combinationId: '770e8400-e29b-41d4-a716-446655440001' },
        { majorId: '660e8400-e29b-41d4-a716-446655440002', combinationId: '770e8400-e29b-41d4-a716-446655440002' },
        
        // HUST - Cơ khí accepts A00
        { majorId: '660e8400-e29b-41d4-a716-446655440003', combinationId: '770e8400-e29b-41d4-a716-446655440001' },
        
        // HUST - KTHH accepts A00, B00
        { majorId: '660e8400-e29b-41d4-a716-446655440004', combinationId: '770e8400-e29b-41d4-a716-446655440001' },
        { majorId: '660e8400-e29b-41d4-a716-446655440004', combinationId: '770e8400-e29b-41d4-a716-446655440005' },
        
        // NEU - KTQT accepts D01, C00
        { majorId: '660e8400-e29b-41d4-a716-446655440005', combinationId: '770e8400-e29b-41d4-a716-446655440003' },
        { majorId: '660e8400-e29b-41d4-a716-446655440005', combinationId: '770e8400-e29b-41d4-a716-446655440004' },
        
        // NEU - QTKD accepts D01, C00
        { majorId: '660e8400-e29b-41d4-a716-446655440006', combinationId: '770e8400-e29b-41d4-a716-446655440003' },
        { majorId: '660e8400-e29b-41d4-a716-446655440006', combinationId: '770e8400-e29b-41d4-a716-446655440004' },
        
        // VNU - Ngôn ngữ Anh accepts D01
        { majorId: '660e8400-e29b-41d4-a716-446655440008', combinationId: '770e8400-e29b-41d4-a716-446655440003' },
        
        // HMU - Y khoa accepts B00
        { majorId: '660e8400-e29b-41d4-a716-446655440010', combinationId: '770e8400-e29b-41d4-a716-446655440005' },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Major-combination relationships created');

    // Create Admission Methods for each school
    const admissionMethods = await prisma.admissionMethod.createMany({
      data: [
        // HUST admission methods
        { schoolId: '550e8400-e29b-41d4-a716-446655440001', name: 'Điểm THPT', percentage: 70 },
        { schoolId: '550e8400-e29b-41d4-a716-446655440001', name: 'Học bạ', percentage: 20 },
        { schoolId: '550e8400-e29b-41d4-a716-446655440001', name: 'Đánh giá năng lực/Đánh giá tư duy', percentage: 10 },
        
        // NEU admission methods
        { schoolId: '550e8400-e29b-41d4-a716-446655440002', name: 'Điểm THPT', percentage: 80 },
        { schoolId: '550e8400-e29b-41d4-a716-446655440002', name: 'Học bạ', percentage: 15 },
        { schoolId: '550e8400-e29b-41d4-a716-446655440002', name: 'Đánh giá năng lực/Đánh giá tư duy', percentage: 5 },
        
        // VNU admission methods
        { schoolId: '550e8400-e29b-41d4-a716-446655440003', name: 'Điểm THPT', percentage: 60 },
        { schoolId: '550e8400-e29b-41d4-a716-446655440003', name: 'Đánh giá năng lực/Đánh giá tư duy', percentage: 40 },
        
        // HMU admission methods
        { schoolId: '550e8400-e29b-41d4-a716-446655440004', name: 'Điểm THPT', percentage: 90 },
        { schoolId: '550e8400-e29b-41d4-a716-446655440004', name: 'Học bạ', percentage: 10 },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Admission methods created');
    console.log('🎉 Application data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding application data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedApplicationData()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedApplicationData };
