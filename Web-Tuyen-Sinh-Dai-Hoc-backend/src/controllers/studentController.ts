import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';

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
        graduationYear,
        // Personal information fields
        ethnicity,
        religion,
        permanentAddress,
        currentAddress,
        guardianName,
        guardianPhone,
        guardianRelation
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
          ethnicity,
          religion,
          permanentAddress,
          currentAddress,
          guardianName,
          guardianPhone,
          guardianRelation,
          status: 'PENDING' // Reset status when updated
        },
        create: {
          studentId: student.id,
          ethnicity,
          religion,
          permanentAddress,
          currentAddress,
          guardianName,
          guardianPhone,
          guardianRelation,
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

      // Get existing achievement to preserve file URL
      const existingAchievement = await prisma.achievement.findUnique({
        where: { studentId: student.id }
      });

      const achievement = await prisma.achievement.upsert({
        where: { studentId: student.id },
        update: {
          type,
          subject,
          year,
          level,
          status: 'PENDING',
          // Preserve existing file URL if it exists
          file: existingAchievement?.file
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

      // Get existing certificate to preserve file URL
      const existingCertificate = await prisma.certificate.findUnique({
        where: { studentId: student.id }
      });

      const certificate = await prisma.certificate.upsert({
        where: { studentId: student.id },
        update: {
          type,
          score: score ? parseFloat(score) : null,
          issueDate,
          testCode,
          issuer,
          issuerOther,
          status: 'PENDING',
          // Preserve existing file URL if it exists
          file: existingCertificate?.file
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

  // File Upload Methods
  static async uploadAchievementFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

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

      // Generate file URL
      const fileUrl = `/uploads/${file.fieldname}/${file.filename}`;

      // Update achievement with file path
      const achievement = await prisma.achievement.upsert({
        where: { studentId: student.id },
        update: {
          file: fileUrl,
          status: 'PENDING' // Reset status when file is uploaded
        },
        create: {
          studentId: student.id,
          type: 'none', // Default type, will be updated when form is submitted
          file: fileUrl,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Achievement file uploaded successfully',
        data: {
          fileUrl,
          achievement
        }
      });
    } catch (error) {
      console.error('Upload achievement file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload achievement file'
      });
    }
  }

  static async uploadCertificateFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

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

      // Generate file URL
      const fileUrl = `/uploads/${file.fieldname}/${file.filename}`;

      // Update certificate with file path
      const certificate = await prisma.certificate.upsert({
        where: { studentId: student.id },
        update: {
          file: fileUrl,
          status: 'PENDING' // Reset status when file is uploaded
        },
        create: {
          studentId: student.id,
          type: 'None', // Default type, will be updated when form is submitted
          file: fileUrl,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'Certificate file uploaded successfully',
        data: {
          fileUrl,
          certificate
        }
      });
    } catch (error) {
      console.error('Upload certificate file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload certificate file'
      });
    }
  }

  // Personal Info File Upload Methods
  static async uploadCccdFrontFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

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

      // Generate file URL
      const fileUrl = `/uploads/${file.fieldname}/${file.filename}`;

      // Update personal info with front CCCD file path
      const personalInfo = await prisma.personalInfo.upsert({
        where: { studentId: student.id },
        update: {
          cccdFrontFile: fileUrl,
          status: 'PENDING' // Reset status when file is uploaded
        },
        create: {
          studentId: student.id,
          cccdFrontFile: fileUrl,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'CCCD front file uploaded successfully',
        data: {
          fileUrl,
          personalInfo
        }
      });
    } catch (error) {
      console.error('Upload CCCD front file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload CCCD front file'
      });
    }
  }

  static async uploadCccdBackFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

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

      // Generate file URL
      const fileUrl = `/uploads/${file.fieldname}/${file.filename}`;

      // Update personal info with back CCCD file path
      const personalInfo = await prisma.personalInfo.upsert({
        where: { studentId: student.id },
        update: {
          cccdBackFile: fileUrl,
          status: 'PENDING' // Reset status when file is uploaded
        },
        create: {
          studentId: student.id,
          cccdBackFile: fileUrl,
          status: 'PENDING'
        }
      });

      res.json({
        success: true,
        message: 'CCCD back file uploaded successfully',
        data: {
          fileUrl,
          personalInfo
        }
      });
    } catch (error) {
      console.error('Upload CCCD back file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload CCCD back file'
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

  // File serving method
  static async serveFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const filePath = req.params[0]; // Get the file path after /files/
      const fullPath = path.join(process.cwd(), 'uploads', filePath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }

      // Send file with proper headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.sendFile(fullPath);
    } catch (error) {
      console.error('Serve file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to serve file'
      });
    }
  }
}