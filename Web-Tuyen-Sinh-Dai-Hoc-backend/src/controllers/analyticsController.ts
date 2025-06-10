// filepath: c:\Users\User\CODING\Web-Tuyen-Sinh-Dai-Hoc\Web-Tuyen-Sinh-Dai-Hoc-backend\src\controllers\analyticsController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export class AnalyticsController {
  // Dashboard Overview Statistics - Core admission system stats
  static async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const [
        totalStudents,
        totalSchools,
        totalMajors,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications
      ] = await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.school.count(),
        prisma.major.count(),
        prisma.application.count(),
        prisma.application.count({ where: { status: 'PENDING' } }),
        prisma.application.count({ where: { status: 'APPROVED' } }),
        prisma.application.count({ where: { status: 'REJECTED' } })
      ]);

      const stats = {
        overview: {
          totalStudents,
          totalSchools,
          totalMajors,
          totalApplications
        },
        applications: {
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
          approvalRate: totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : '0'
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics'
      });
    }
  }

  // School-wise Application Statistics
  static async getSchoolApplicationStats(req: Request, res: Response): Promise<void> {
    try {
      const schoolStats = await prisma.school.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          totalQuota: true,
          majors: {
            select: {
              id: true,
              name: true,
              quota: true,
              applications: {
                select: {
                  status: true
                }
              }
            }
          }
        }
      });

      const formattedStats = schoolStats.map(school => {
        const totalApplications = school.majors.reduce((sum, major) => sum + major.applications.length, 0);
        const approvedApplications = school.majors.reduce((sum, major) => 
          sum + major.applications.filter(app => app.status === 'APPROVED').length, 0);
        const pendingApplications = school.majors.reduce((sum, major) => 
          sum + major.applications.filter(app => app.status === 'PENDING').length, 0);
        const rejectedApplications = school.majors.reduce((sum, major) => 
          sum + major.applications.filter(app => app.status === 'REJECTED').length, 0);
        
        const totalMajorQuota = school.majors.reduce((sum, major) => sum + major.quota, 0);

        return {
          id: school.id,
          name: school.name,
          code: school.code,
          totalQuota: school.totalQuota,
          totalMajorQuota,
          totalApplications,
          approvedApplications,
          pendingApplications,
          rejectedApplications,
          majors: school.majors.map(major => ({
            id: major.id,
            name: major.name,
            quota: major.quota,
            applications: major.applications.length,
            approved: major.applications.filter(app => app.status === 'APPROVED').length,
            pending: major.applications.filter(app => app.status === 'PENDING').length,
            rejected: major.applications.filter(app => app.status === 'REJECTED').length
          }))
        };
      });

      res.json({
        success: true,
        data: formattedStats
      });
    } catch (error) {
      console.error('Error fetching school application stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch school application statistics'
      });
    }
  }

  // Major-wise Application Statistics
  static async getMajorApplicationStats(req: Request, res: Response): Promise<void> {
    try {
      const majorStats = await prisma.major.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          quota: true,
          school: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          applications: {
            select: {
              status: true
            }
          }
        }
      });

      const formattedStats = majorStats.map(major => {
        const totalApplications = major.applications.length;
        const approvedApplications = major.applications.filter(app => app.status === 'APPROVED').length;
        const pendingApplications = major.applications.filter(app => app.status === 'PENDING').length;
        const rejectedApplications = major.applications.filter(app => app.status === 'REJECTED').length;
        
        return {
          id: major.id,
          name: major.name,
          code: major.code,
          quota: major.quota,
          school: major.school,
          totalApplications,
          approvedApplications,
          pendingApplications,
          rejectedApplications
        };
      });

      res.json({
        success: true,
        data: formattedStats
      });
    } catch (error) {
      console.error('Error fetching major application stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch major application statistics'
      });
    }
  }

  // Application Status Statistics
  static async getApplicationStatusStats(req: Request, res: Response): Promise<void> {
    try {
      const statusStats = await prisma.application.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      });

      const formattedStats = statusStats.map(stat => ({
        status: stat.status,
        count: stat._count.status
      }));

      res.json({
        success: true,
        data: formattedStats
      });
    } catch (error) {
      console.error('Error fetching application status stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application status statistics'
      });
    }
  }
  // Recent Applications Activity
  static async getRecentApplications(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      const recentApplications = await prisma.application.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          student: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true
                }
              }
            }
          },
          major: {
            select: {
              name: true,
              school: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: recentApplications
      });
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent applications'
      });
    }
  }
  // Document Verification Statistics (based on personal info, scores, etc.)
  static async getDocumentStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalPersonalInfos,
        approvedPersonalInfos,
        pendingPersonalInfos,
        rejectedPersonalInfos,
        totalScores,
        approvedScores,
        pendingScores,
        rejectedScores
      ] = await Promise.all([
        prisma.personalInfo.count(),
        prisma.personalInfo.count({ where: { status: 'APPROVED' } }),
        prisma.personalInfo.count({ where: { status: 'PENDING' } }),
        prisma.personalInfo.count({ where: { status: 'REJECTED' } }),
        prisma.score.count(),
        prisma.score.count({ where: { status: 'APPROVED' } }),
        prisma.score.count({ where: { status: 'PENDING' } }),
        prisma.score.count({ where: { status: 'REJECTED' } })
      ]);

      const totalDocuments = totalPersonalInfos + totalScores;
      const approvedDocuments = approvedPersonalInfos + approvedScores;
      const pendingDocuments = pendingPersonalInfos + pendingScores;
      const rejectedDocuments = rejectedPersonalInfos + rejectedScores;

      const stats = {
        total: totalDocuments,
        approved: approvedDocuments,
        pending: pendingDocuments,
        rejected: rejectedDocuments,
        approvalRate: totalDocuments > 0 ? ((approvedDocuments / totalDocuments) * 100).toFixed(1) : '0',
        breakdown: {
          personalInfo: {
            total: totalPersonalInfos,
            approved: approvedPersonalInfos,
            pending: pendingPersonalInfos,
            rejected: rejectedPersonalInfos
          },
          scores: {
            total: totalScores,
            approved: approvedScores,
            pending: pendingScores,
            rejected: rejectedScores
          }
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching document stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch document statistics'
      });
    }
  }

  // Basic Application Trends (last 30 days)
  static async getApplicationTrends(req: Request, res: Response): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const applications = await prisma.application.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        select: {
          createdAt: true,
          status: true
        }
      });

      // Group by date
      const dailyTrends = applications.reduce((acc: any, app) => {
        const date = app.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, total: 0, pending: 0, approved: 0, rejected: 0 };
        }
        acc[date].total++;
        acc[date][app.status.toLowerCase()]++;
        return acc;
      }, {});

      const trendsArray = Object.values(dailyTrends).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      res.json({
        success: true,
        data: trendsArray
      });
    } catch (error) {
      console.error('Error fetching application trends:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application trends'
      });
    }
  }
}
