import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalStudents,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalSchools,
      totalMajors
    ] = await Promise.all([
      prisma.student.count(),
      prisma.personalInfo.count({ where: { status: 'PENDING' } }),
      prisma.personalInfo.count({ where: { status: 'APPROVED' } }),
      prisma.personalInfo.count({ where: { status: 'REJECTED' } }),
      prisma.school.count(),
      prisma.major.count()
    ]);

    ApiResponse.success(res, 'Dashboard statistics retrieved successfully', {
      totalStudents,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalSchools,
      totalMajors
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    ApiResponse.error(res, 'Failed to get dashboard statistics', 500);
  }
};

export const getAllStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    
    if (status && status !== 'all') {
      whereClause.personalInfo = {
        status: status.toString().toUpperCase()
      };
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search.toString() } },
        { email: { contains: search.toString() } },
        { citizenId: { contains: search.toString() } }
      ];
    }

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
        include: {
          personalInfo: true,
          applications: {
            include: {
              school: true,
              major: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.count({ where: whereClause })
    ]);

    ApiResponse.success(res, 'Students retrieved successfully', {
      students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all students error:', error);
    ApiResponse.error(res, 'Failed to get students', 500);
  }
};

export const getStudentDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        personalInfo: true,
        priority: true,
        scores: true,
        achievements: true,
        applications: {
          include: {
            school: true,
            major: true,
            admissionCombination: true
          }
        },
        proofs: true
      }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    ApiResponse.success(res, 'Student details retrieved successfully', student);
  } catch (error) {
    console.error('Get student details error:', error);
    ApiResponse.error(res, 'Failed to get student details', 500);
  }
};

export const updateStudentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { status, reason, type = 'personal' } = req.body;

    let updatedRecord;

    switch (type) {
      case 'personal':
        updatedRecord = await prisma.personalInfo.upsert({
          where: { studentId },
          update: {
            status,
            reason: status === 'REJECTED' ? reason : null
          },
          create: {
            studentId,
            status,
            reason: status === 'REJECTED' ? reason : null
          }
        });
        break;

      case 'priority':
        updatedRecord = await prisma.priority.upsert({
          where: { studentId },
          update: {
            status,
            reason: status === 'REJECTED' ? reason : null
          },
          create: {
            studentId,
            status,
            reason: status === 'REJECTED' ? reason : null
          }
        });
        break;

      default:
        ApiResponse.error(res, 'Invalid status type', 400);
        return;
    }

    ApiResponse.success(res, 'Student status updated successfully', updatedRecord);
  } catch (error) {
    console.error('Update student status error:', error);
    ApiResponse.error(res, 'Failed to update student status', 500);
  }
};