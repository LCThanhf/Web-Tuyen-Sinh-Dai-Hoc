import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getStudentApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        school: true,
        major: true,
        admissionCombination: true
      },
      orderBy: { priorityOrder: 'asc' }
    });

    ApiResponse.success(res, 'Applications retrieved successfully', applications);
  } catch (error) {
    console.error('Get student applications error:', error);
    ApiResponse.error(res, 'Failed to get applications', 500);
  }
};

export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      schoolId,
      majorId,
      admissionCombinationId,
      admissionMethod,
      organizingUnit,
      priorityOrder
    } = req.body;

    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    // Check if priority order already exists
    const existingApplication = await prisma.application.findFirst({
      where: {
        studentId: student.id,
        priorityOrder: parseInt(priorityOrder)
      }
    });

    if (existingApplication) {
      ApiResponse.error(res, 'Priority order already exists', 400);
      return;
    }

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        schoolId,
        majorId,
        admissionCombinationId,
        admissionMethod,
        organizingUnit,
        priorityOrder: parseInt(priorityOrder)
      },
      include: {
        school: true,
        major: true,
        admissionCombination: true
      }
    });

    ApiResponse.success(res, 'Application created successfully', application, 201);
  } catch (error) {
    console.error('Create application error:', error);
    ApiResponse.error(res, 'Failed to create application', 500);
  }
};

export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const {
      schoolId,
      majorId,
      admissionCombinationId,
      admissionMethod,
      organizingUnit,
      priorityOrder
    } = req.body;

    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    // Verify application belongs to student
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId: student.id
      }
    });

    if (!existingApplication) {
      ApiResponse.error(res, 'Application not found', 404);
      return;
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...(schoolId && { schoolId }),
        ...(majorId && { majorId }),
        ...(admissionCombinationId && { admissionCombinationId }),
        ...(admissionMethod && { admissionMethod }),
        ...(organizingUnit && { organizingUnit }),
        ...(priorityOrder && { priorityOrder: parseInt(priorityOrder) })
      },
      include: {
        school: true,
        major: true,
        admissionCombination: true
      }
    });

    ApiResponse.success(res, 'Application updated successfully', application);
  } catch (error) {
    console.error('Update application error:', error);
    ApiResponse.error(res, 'Failed to update application', 500);
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;

    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    // Verify application belongs to student
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId: student.id
      }
    });

    if (!existingApplication) {
      ApiResponse.error(res, 'Application not found', 404);
      return;
    }

    await prisma.application.delete({
      where: { id: applicationId }
    });

    ApiResponse.success(res, 'Application deleted successfully');
  } catch (error) {
    console.error('Delete application error:', error);
    ApiResponse.error(res, 'Failed to delete application', 500);
  }
};