import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export class StudentController {
  // Personal Information
  static async getPersonalInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId },
        include: { 
          personalInfo: true,
          user: {
            select: {
              cccd: true,
              fullName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          student,
          personalInfo: student.personalInfo
        }
      });
    } catch (error) {
      console.error('Get personal info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch personal information'
      });
    }
  }

  static async updatePersonalInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { 
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

      // First, find or create student record
      let student = await prisma.student.findUnique({
        where: { userId: req.user!.userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student record not found'
        });
        return;
      }

      // Update student basic info
      student = await prisma.student.update({
        where: { id: student.id },
        data: {
          dob: new Date(dob),
          gender: gender.toUpperCase(),
          cccdIssuePlace,
          cccdIssueDate: new Date(cccdIssueDate),
          address,
          city,
          district,
          highSchoolName,
          graduationYear: parseInt(graduationYear)
        }
      });

      // Update or create personal info record
      const personalInfo = await prisma.personalInfo.upsert({
        where: { studentId: student.id },
        update: {
          status: 'PENDING' // Reset status when updated
        },
        create: {
          studentId: student.id,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Personal information updated successfully',
        data: { student, personalInfo }
      });
    } catch (error) {
      console.error('Update personal info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update personal information'
      });
    }
  }

  // Scores Management
  static async getScores(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId },
        include: { scores: true }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      res.json({
        success: true,
        data: student.scores
      });
    } catch (error) {
      console.error('Get scores error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch scores'
      });
    }
  }

  static async upsertScore(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      const { type, ...scoreData } = req.body;

      // Delete existing score of the same type (since frontend only allows one per type)
      await prisma.score.deleteMany({
        where: {
          studentId: student.id,
          type: type
        }
      });

      // Create new score
      const score = await prisma.score.create({
        data: {
          studentId: student.id,
          type,
          ...scoreData,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Score saved successfully',
        data: score
      });
    } catch (error) {
      console.error('Upsert score error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save score'
      });
    }
  }

  // Priority Management
  static async getPriority(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId },
        include: { priorities: true }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      res.json({
        success: true,
        data: student.priorities[0] || null
      });
    } catch (error) {
      console.error('Get priority error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch priority information'
      });
    }
  }

  static async updatePriority(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { priorityArea, priorityObject } = req.body;

      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      const priority = await prisma.priority.upsert({
        where: { studentId: student.id },
        update: {
          priorityArea,
          priorityObject,
          status: 'PENDING'
        },
        create: {
          studentId: student.id,
          priorityArea,
          priorityObject,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Priority information updated successfully',
        data: priority
      });
    } catch (error) {
      console.error('Update priority error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update priority information'
      });
    }
  }

  // Achievement Management
  static async getAchievement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId },
        include: { achievements: true }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      res.json({
        success: true,
        data: student.achievements[0] || null
      });
    } catch (error) {
      console.error('Get achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch achievement information'
      });
    }
  }

  static async updateAchievement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type, subject, year, level } = req.body;

      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      const achievement = await prisma.achievement.upsert({
        where: { studentId: student.id },
        update: {
          type,
          subject,
          year,
          level,
          status: 'PENDING'
        },
        create: {
          studentId: student.id,
          type,
          subject,
          year,
          level,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Achievement information updated successfully',
        data: achievement
      });
    } catch (error) {
      console.error('Update achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update achievement information'
      });
    }
  }

  // Certificate Management
  static async getCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId },
        include: { certificates: true }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      res.json({
        success: true,
        data: student.certificates[0] || null
      });
    } catch (error) {
      console.error('Get certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch certificate information'
      });
    }
  }

  static async updateCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type, score, issueDate, testCode, issuer, issuerOther } = req.body;

      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      const certificate = await prisma.certificate.upsert({
        where: { studentId: student.id },
        update: {
          type,
          score: score ? parseFloat(score) : null,
          issueDate,
          testCode,
          issuer,
          issuerOther,
          status: 'PENDING'
        },
        create: {
          studentId: student.id,
          type,
          score: score ? parseFloat(score) : null,
          issueDate,
          testCode,
          issuer,
          issuerOther,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Certificate information updated successfully',
        data: certificate
      });
    } catch (error) {
      console.error('Update certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update certificate information'
      });
    }
  }

  // Delete Methods
  static async deleteScore(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      // Check if score exists and belongs to the student
      const score = await prisma.score.findFirst({
        where: {
          id,
          studentId: student.id
        }
      });

      if (!score) {
        res.status(404).json({
          success: false,
          message: 'Score not found'
        });
        return;
      }

      // Delete the score
      await prisma.score.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Score deleted successfully'
      });
    } catch (error) {
      console.error('Delete score error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete score'
      });
    }
  }

  static async deletePersonalInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId },
        include: { personalInfo: true }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      // Delete personal info if exists
      if (student.personalInfo) {
        await prisma.personalInfo.delete({
          where: { studentId: student.id }
        });
      }

      res.json({
        success: true,
        message: 'Personal information deleted successfully'
      });
    } catch (error) {
      console.error('Delete personal info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete personal information'
      });
    }
  }

  static async deletePriority(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      // Delete priority records for this student
      await prisma.priority.deleteMany({
        where: { studentId: student.id }
      });

      res.json({
        success: true,
        message: 'Priority information deleted successfully'
      });
    } catch (error) {
      console.error('Delete priority error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete priority information'
      });
    }
  }

  static async deleteAchievement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      // Delete achievement records for this student
      await prisma.achievement.deleteMany({
        where: { studentId: student.id }
      });

      res.json({
        success: true,
        message: 'Achievement information deleted successfully'
      });
    } catch (error) {
      console.error('Delete achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete achievement information'
      });
    }
  }

  static async deleteCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      // Delete certificate records for this student
      await prisma.certificate.deleteMany({
        where: { studentId: student.id }
      });

      res.json({
        success: true,
        message: 'Certificate information deleted successfully'
      });
    } catch (error) {
      console.error('Delete certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete certificate information'
      });
    }
  }
}