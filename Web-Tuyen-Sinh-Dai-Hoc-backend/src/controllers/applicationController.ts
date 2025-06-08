import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export class ApplicationController {
  // Get all applications for the current student
  static async getApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId },
      });

      if (!student) {
        res.status(404).json({ 
          success: false,
          message: 'Student not found' 
        });
        return;
      }

      const applications = await prisma.application.findMany({
        where: { studentId: student.id },
        include: {
          school: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          major: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
        },
        orderBy: {
          priorityOrder: 'asc'
        }
      });

      res.json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Submit a new application
  static async submitApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const {
        schoolId,
        majorId,
        combinationId,
        admissionMethod,
        organizingUnit,
        priorityOrder
      } = req.body;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId },
      });

      if (!student) {
        res.status(404).json({ 
          success: false,
          message: 'Student not found' 
        });
        return;
      }

      // Validate required fields
      if (!schoolId || !majorId || !admissionMethod) {
        res.status(400).json({
          success: false,
          message: 'School, major, and admission method are required'
        });
        return;
      }

      // Check if school exists
      const school = await prisma.school.findUnique({
        where: { id: schoolId }
      });

      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Check if major exists and belongs to the school
      const major = await prisma.major.findFirst({
        where: { 
          id: majorId,
          schoolId: schoolId
        }
      });

      if (!major) {
        res.status(404).json({
          success: false,
          message: 'Major not found or does not belong to the selected school'
        });
        return;
      }

      // Check if student already has an application for this school and major
      const existingApplication = await prisma.application.findUnique({
        where: {
          studentId_schoolId_majorId: {
            studentId: student.id,
            schoolId: schoolId,
            majorId: majorId
          }
        }
      });

      if (existingApplication) {
        res.status(400).json({
          success: false,
          message: 'You have already applied to this major at this school'
        });
        return;
      }

      // Get current max priority order for this student
      const maxPriorityResult = await prisma.application.aggregate({
        where: { studentId: student.id },
        _max: { priorityOrder: true }
      });

      const nextPriorityOrder = priorityOrder || (maxPriorityResult._max.priorityOrder || 0) + 1;

      // Create new application
      const newApplication = await prisma.application.create({
        data: {
          studentId: student.id,
          schoolId,
          majorId,
          combinationId,
          admissionMethod,
          organizingUnit,
          priorityOrder: nextPriorityOrder,
          status: 'PENDING'
        },
        include: {
          school: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          major: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
        }
      });

      res.status(201).json({
        success: true,
        data: newApplication,
        message: 'Application submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update application priority order
  static async updateApplicationPriority(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { applicationId } = req.params;
      const { priorityOrder } = req.body;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId },
      });

      if (!student) {
        res.status(404).json({ 
          success: false,
          message: 'Student not found' 
        });
        return;
      }

      // Check if application exists and belongs to the student
      const application = await prisma.application.findFirst({
        where: {
          id: applicationId,
          studentId: student.id
        }
      });

      if (!application) {
        res.status(404).json({
          success: false,
          message: 'Application not found'
        });
        return;
      }

      // Update priority order
      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { priorityOrder },
        include: {
          school: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          major: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
        }
      });

      res.json({
        success: true,
        data: updatedApplication,
        message: 'Application priority updated successfully'
      });
    } catch (error) {
      console.error('Error updating application priority:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete an application
  static async deleteApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { applicationId } = req.params;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId },
      });

      if (!student) {
        res.status(404).json({ 
          success: false,
          message: 'Student not found' 
        });
        return;
      }

      // Check if application exists and belongs to the student
      const application = await prisma.application.findFirst({
        where: {
          id: applicationId,
          studentId: student.id
        }
      });

      if (!application) {
        res.status(404).json({
          success: false,
          message: 'Application not found'
        });
        return;
      }

      // Delete application
      await prisma.application.delete({
        where: { id: applicationId }
      });

      res.json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get application status
  static async getApplicationStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { applicationId } = req.params;

      // Get student record
      const student = await prisma.student.findUnique({
        where: { userId },
      });

      if (!student) {
        res.status(404).json({ 
          success: false,
          message: 'Student not found' 
        });
        return;
      }

      const application = await prisma.application.findFirst({
        where: {
          id: applicationId,
          studentId: student.id
        },
        include: {
          school: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          major: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
        }
      });

      if (!application) {
        res.status(404).json({
          success: false,
          message: 'Application not found'
        });
        return;
      }

      res.json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error fetching application status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get schools (for dropdown)
  static async getSchools(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const schools = await prisma.school.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: schools
      });
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get majors by school (for dropdown)
  static async getMajorsBySchool(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { schoolId } = req.params;

      const majors = await prisma.major.findMany({
        where: { 
          schoolId,
          isActive: true 
        },
        select: {
          id: true,
          name: true,
          code: true,
          quota: true,
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: majors
      });
    } catch (error) {
      console.error('Error fetching majors:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get admission combinations (for dropdown)
  static async getAdmissionCombinations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const combinations = await prisma.admissionCombination.findMany({
        select: {
          id: true,
          name: true,
          subjects: true,
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: combinations
      });
    } catch (error) {
      console.error('Error fetching admission combinations:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
