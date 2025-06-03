import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getAllMajors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.query;

    const whereClause: any = {};
    if (schoolId) {
      whereClause.schoolId = schoolId.toString();
    }

    const majors = await prisma.major.findMany({
      where: whereClause,
      include: {
        school: true,
        admissionCombinations: true,
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    ApiResponse.success(res, 'Majors retrieved successfully', majors);
  } catch (error) {
    console.error('Get majors error:', error);
    ApiResponse.error(res, 'Failed to get majors', 500);
  }
};

export const getMajorsBySchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;

    const majors = await prisma.major.findMany({
      where: { schoolId },
      include: {
        admissionCombinations: true,
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    ApiResponse.success(res, 'Majors retrieved successfully', majors);
  } catch (error) {
    console.error('Get majors by school error:', error);
    ApiResponse.error(res, 'Failed to get majors', 500);
  }
};

export const createMajor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, schoolId, quota } = req.body;

    const major = await prisma.major.create({
      data: {
        name,
        code,
        schoolId,
        quota: parseInt(quota)
      },
      include: {
        school: true
      }
    });

    ApiResponse.success(res, 'Major created successfully', major, 201);
  } catch (error) {
    console.error('Create major error:', error);
    ApiResponse.error(res, 'Failed to create major', 500);
  }
};

export const updateMajor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { majorId } = req.params;
    const { name, code, quota } = req.body;

    const major = await prisma.major.update({
      where: { id: majorId },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(quota && { quota: parseInt(quota) })
      },
      include: {
        school: true
      }
    });

    ApiResponse.success(res, 'Major updated successfully', major);
  } catch (error) {
    console.error('Update major error:', error);
    ApiResponse.error(res, 'Failed to update major', 500);
  }
};

export const deleteMajor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { majorId } = req.params;

    await prisma.major.delete({
      where: { id: majorId }
    });

    ApiResponse.success(res, 'Major deleted successfully');
  } catch (error) {
    console.error('Delete major error:', error);
    ApiResponse.error(res, 'Failed to delete major', 500);
  }
};