import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getStudentProofs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    const proofs = await prisma.proof.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' }
    });

    ApiResponse.success(res, 'Proofs retrieved successfully', proofs);
  } catch (error) {
    console.error('Get student proofs error:', error);
    ApiResponse.error(res, 'Failed to get proofs', 500);
  }
};

export const createProof = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, fileName, filePath, isRequired } = req.body;

    const student = await prisma.student.findFirst({
      where: { userId: req.user!.userId }
    });

    if (!student) {
      ApiResponse.error(res, 'Student not found', 404);
      return;
    }

    const proof = await prisma.proof.create({
      data: {
        studentId: student.id,
        type,
        fileName,
        filePath,
        isRequired: Boolean(isRequired)
      }
    });

    ApiResponse.success(res, 'Proof created successfully', proof, 201);
  } catch (error) {
    console.error('Create proof error:', error);
    ApiResponse.error(res, 'Failed to create proof', 500);
  }
};

export const updateProofStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { proofId } = req.params;
    const { status, reason } = req.body;

    const proof = await prisma.proof.update({
      where: { id: proofId },
      data: {
        status,
        reason: status === 'REJECTED' ? reason : null
      }
    });

    ApiResponse.success(res, 'Proof status updated successfully', proof);
  } catch (error) {
    console.error('Update proof status error:', error);
    ApiResponse.error(res, 'Failed to update proof status', 500);
  }
};

export const getAllProofsForAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status.toString().toUpperCase();
    }

    const [proofs, totalCount] = await Promise.all([
      prisma.proof.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              fullName: true,
              citizenId: true,
              email: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.proof.count({ where: whereClause })
    ]);

    ApiResponse.success(res, 'Proofs retrieved successfully', {
      proofs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all proofs error:', error);
    ApiResponse.error(res, 'Failed to get proofs', 500);
  }
};