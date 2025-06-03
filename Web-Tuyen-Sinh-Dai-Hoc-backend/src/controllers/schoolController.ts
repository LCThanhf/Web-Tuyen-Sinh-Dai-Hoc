import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getAllSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        majors: true,
        _count: {
          select: {
            majors: true,
            applications: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    ApiResponse.success(res, 'Schools retrieved successfully', schools);
  } catch (error) {
    console.error('Get schools error:', error);
    ApiResponse.error(res, 'Failed to get schools', 500);
  }
};

export const getSchoolById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        majors: {
          include: {
            admissionCombinations: true,
            _count: {
              select: { applications: true }
            }
          }
        },
        admissionMethods: true
      }
    });

    if (!school) {
      ApiResponse.error(res, 'School not found', 404);
      return;
    }

    ApiResponse.success(res, 'School retrieved successfully', school);
  } catch (error) {
    console.error('Get school error:', error);
    ApiResponse.error(res, 'Failed to get school', 500);
  }
};

export const createSchool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, totalQuota } = req.body;

    // Check if school code already exists
    const existingSchool = await prisma.school.findUnique({
      where: { code }
    });

    if (existingSchool) {
      ApiResponse.error(res, 'School code already exists', 400);
      return;
    }

    const school = await prisma.school.create({
      data: {
        name,
        code,
        totalQuota: parseInt(totalQuota)
      }
    });

    ApiResponse.success(res, 'School created successfully', school, 201);
  } catch (error) {
    console.error('Create school error:', error);
    ApiResponse.error(res, 'Failed to create school', 500);
  }
};

export const updateSchool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const { name, code, totalQuota } = req.body;

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(totalQuota && { totalQuota: parseInt(totalQuota) })
      }
    });

    ApiResponse.success(res, 'School updated successfully', school);
  } catch (error) {
    console.error('Update school error:', error);
    ApiResponse.error(res, 'Failed to update school', 500);
  }
};

export const deleteSchool = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;

    await prisma.school.delete({
      where: { id: schoolId }
    });

    ApiResponse.success(res, 'School deleted successfully');
  } catch (error) {
    console.error('Delete school error:', error);
    ApiResponse.error(res, 'Failed to delete school', 500);
  }
};