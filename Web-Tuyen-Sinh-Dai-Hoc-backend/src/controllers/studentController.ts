import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId },
      include: {
        personalInfo: true,
        priority: true,
        scores: true,
        achievements: true,
        applications: {
          include: {
            school: true,
            major: true
          }
        }
      }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    ApiResponse.success(res, 'Profile retrieved successfully', student);
  } catch (error) {
    console.error('Get profile error:', error);
    ApiResponse.error(res, 'Failed to get profile', 500);
  }
};

export const updatePersonalInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      dob,
      gender,
      cccdIssuePlace,
      cccdIssueDate,
      address,
      city,
      district,
      highSchoolName,
      graduationYear
    } = req.body;

    // Find student
    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId },
      include: { personalInfo: true }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    // Check if personal info is rejected or pending (can edit)
    if (student.personalInfo?.status === 'APPROVED') {
      ApiResponse.error(res, 'Cannot edit approved personal information', 400);
      return;
    }

    // Update student information
    const updatedStudent = await prisma.$transaction(async (tx) => {
      const updated = await tx.student.update({
        where: { id: student.id },
        data: {
          ...(fullName && { fullName }),
          ...(phone && { phone }),
          ...(dob && { dob: new Date(dob) }),
          ...(gender && { gender: gender.toUpperCase() }),
          ...(cccdIssuePlace && { cccdIssuePlace }),
          ...(cccdIssueDate && { cccdIssueDate: new Date(cccdIssueDate) }),
          ...(address && { address }),
          ...(city && { city }),
          ...(district && { district }),
          ...(highSchoolName && { highSchoolName }),
          ...(graduationYear && { graduationYear: parseInt(graduationYear) })
        }
      });

      // Reset personal info status to PENDING when updated
      await tx.personalInfo.upsert({
        where: { studentId: student.id },
        update: {
          status: 'PENDING',
          reason: null
        },
        create: {
          studentId: student.id,
          status: 'PENDING'
        }
      });

      return updated;
    });

    ApiResponse.success(res, 'Personal information updated successfully', updatedStudent);
  } catch (error) {
    console.error('Update personal info error:', error);
    ApiResponse.error(res, 'Failed to update personal information', 500);
  }
};

export const getPersonalInfoStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId },
      include: { personalInfo: true }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    const statusMapping = {
      'PENDING': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối'
    };

    ApiResponse.success(res, 'Status retrieved successfully', {
      status: statusMapping[student.personalInfo?.status || 'PENDING'],
      reason: student.personalInfo?.reason || null
    });
  } catch (error) {
    console.error('Get status error:', error);
    ApiResponse.error(res, 'Failed to get status', 500);
  }
};

export const updatePersonalInfoStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { status, reason } = req.body;

    const personalInfo = await prisma.personalInfo.upsert({
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

    ApiResponse.success(res, 'Status updated successfully', personalInfo);
  } catch (error) {
    console.error('Update status error:', error);
    ApiResponse.error(res, 'Failed to update status', 500);
  }
};