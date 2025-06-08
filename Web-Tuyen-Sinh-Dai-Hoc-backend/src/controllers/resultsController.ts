import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

interface StudentResult {
  studentId: string;
  cccd: string;
  fullName: string;
  overallStatus: 'ADMITTED' | 'WAITLISTED' | 'REJECTED' | 'PENDING';
  applications: ApplicationResult[];
}

interface ApplicationResult {
  applicationId: string;
  majorId: string;
  majorName: string;
  schoolId: string;
  schoolName: string;
  priorityOrder: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  submissionDate: Date;
  lastUpdated: Date;
  adminNotes?: string;
  cutoffScore?: number;
  studentScore?: number;
  rank?: number;
}

export class ResultsController {
  // Get admission results for a specific student
  static async getStudentResults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user?.userId;
      if (!studentId) {
        res.status(401).json({
          success: false,
          message: 'Student authentication required'
        });
        return;
      }      const student = await prisma.student.findUnique({
        where: { userId: studentId },
        include: {
          user: {
            select: {
              fullName: true,
              cccd: true
            }
          },
          applications: {
            include: {
              major: {
                include: {
                  school: true
                }
              }
            },
            orderBy: {
              priorityOrder: 'asc'
            }
          },
          scores: {
            where: {
              status: 'APPROVED'
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found'
        });
        return;
      }

      // Calculate student's total score
      let studentTotalScore = 0;
      if (student.scores.length > 0) {
        const latestScore = student.scores[0];
        const scores = latestScore.scores as any;

        if (latestScore.type === 'THPT') {
          studentTotalScore = (scores.toan || 0) + (scores.ly || 0) + (scores.hoa || 0);
        } else if (latestScore.type === 'TRANSCRIPT') {
          const subjects = Object.values(scores).filter(score => typeof score === 'number') as number[];
          const average = subjects.length > 0 ? subjects.reduce((sum, score) => sum + score, 0) / subjects.length : 0;
          studentTotalScore = average * 3;
        } else if (latestScore.type === 'ASSESSMENT') {
          studentTotalScore = scores.total || scores.tongDiem || 0;
        }
      }      // Get cutoff predictions for student's applied majors
      const majorIds = student.applications.map(app => app.majorId);
      const cutoffData = await ResultsController.calculateCutoffScores(majorIds);

      // Format application results
      const applicationResults: ApplicationResult[] = student.applications.map(app => {
        const cutoffInfo = cutoffData.get(app.majorId);
        
        return {
          applicationId: app.id,
          majorId: app.major.id,
          majorName: app.major.name,
          schoolId: app.major.school.id,
          schoolName: app.major.school.name,
          priorityOrder: app.priorityOrder,
          status: app.status,
          submissionDate: app.createdAt,
          lastUpdated: app.updatedAt,
          adminNotes: app.adminNote || undefined,
          cutoffScore: cutoffInfo?.cutoffScore,
          studentScore: studentTotalScore > 0 ? studentTotalScore : undefined,
          rank: cutoffInfo?.rank
        };
      });

      // Determine overall status
      let overallStatus: string;
      const hasApproved = applicationResults.some(app => app.status === 'APPROVED');
      const hasPending = applicationResults.some(app => app.status === 'PENDING');
      
      if (hasApproved) {
        overallStatus = 'Trúng tuyển';
      } else if (hasPending) {
        overallStatus = 'Chờ kết quả';
      } else {
        overallStatus = 'Chưa trúng tuyển';
      }

      // Transform applications to match the expected format
      const transformedApplications = applicationResults.map(app => ({
        majorName: app.majorName,
        schoolName: app.schoolName,
        priorityOrder: app.priorityOrder,
        status: app.status,
        cutoffScore: app.cutoffScore,
        studentScore: studentTotalScore > 0 ? studentTotalScore : undefined,
        isAboveCutoff: app.cutoffScore && studentTotalScore > 0 
          ? studentTotalScore >= app.cutoffScore 
          : undefined
      }));

      const result = {
        cccd: student.user.cccd,
        fullName: student.user.fullName,
        overallStatus,
        applications: transformedApplications,
        totalScore: studentTotalScore > 0 ? studentTotalScore : undefined
      };

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error fetching student results:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admission results'
      });
    }
  }

  // Public endpoint to check results by CCCD
  static async checkResultsByCCCD(req: Request, res: Response): Promise<void> {
    try {
      const { cccd } = req.params;

      if (!cccd || !/^[0-9]{9,12}$/.test(cccd)) {
        res.status(400).json({
          success: false,
          message: 'Invalid CCCD format'
        });
        return;
      }      const student = await prisma.student.findFirst({
        where: { 
          user: { 
            cccd: cccd 
          } 
        },
        include: {
          user: {
            select: {
              fullName: true,
              cccd: true
            }
          },
          applications: {
            include: {
              major: {
                include: {
                  school: true
                }
              }
            },
            orderBy: {
              priorityOrder: 'asc'
            }
          },
          scores: {
            where: {
              status: 'APPROVED'
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      });

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'No results found for this CCCD'
        });
        return;
      }

      // Calculate student's total score
      let studentTotalScore = 0;
      if (student.scores.length > 0) {
        const latestScore = student.scores[0];
        const scores = latestScore.scores as any;

        if (latestScore.type === 'THPT') {
          studentTotalScore = (scores.toan || 0) + (scores.ly || 0) + (scores.hoa || 0);
        } else if (latestScore.type === 'TRANSCRIPT') {
          const subjects = Object.values(scores).filter(score => typeof score === 'number') as number[];
          const average = subjects.length > 0 ? subjects.reduce((sum, score) => sum + score, 0) / subjects.length : 0;
          studentTotalScore = average * 3;
        } else if (latestScore.type === 'ASSESSMENT') {
          studentTotalScore = scores.total || scores.tongDiem || 0;
        }
      }      // Get cutoff information
      const majorIds = student.applications.map(app => app.majorId);
      const cutoffData = await ResultsController.calculateCutoffScores(majorIds);

      const applicationResults = student.applications.map(app => {
        const cutoffInfo = cutoffData.get(app.majorId);
        
        return {
          majorName: app.major.name,
          schoolName: app.major.school.name,
          priorityOrder: app.priorityOrder,
          status: app.status,
          cutoffScore: cutoffInfo?.cutoffScore,
          studentScore: studentTotalScore > 0 ? studentTotalScore : undefined,
          isAboveCutoff: cutoffInfo?.cutoffScore && studentTotalScore > 0 
            ? studentTotalScore >= cutoffInfo.cutoffScore 
            : undefined
        };
      });

      // Determine overall status
      const hasApproved = applicationResults.some(app => app.status === 'APPROVED');
      const hasPending = applicationResults.some(app => app.status === 'PENDING');
      
      let overallStatus: string;
      if (hasApproved) {
        overallStatus = 'Trúng tuyển';
      } else if (hasPending) {
        overallStatus = 'Chờ kết quả';
      } else {
        overallStatus = 'Chưa trúng tuyển';
      }

      res.json({
        success: true,        data: {
          cccd: student.user.cccd,
          fullName: student.user.fullName,
          overallStatus,
          applications: applicationResults,
          totalScore: studentTotalScore > 0 ? studentTotalScore : undefined
        }
      });

    } catch (error) {
      console.error('Error checking results by CCCD:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check admission results'
      });
    }
  }

  // Get admission statistics and trends
  static async getAdmissionStatistics(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalApplications,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        uniqueStudents,
        schoolStats
      ] = await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { status: 'APPROVED' } }),
        prisma.application.count({ where: { status: 'PENDING' } }),
        prisma.application.count({ where: { status: 'REJECTED' } }),
        prisma.application.groupBy({
          by: ['studentId'],
          _count: true
        }),
        prisma.school.findMany({
          include: {
            majors: {
              include: {
                applications: {
                  select: {
                    status: true
                  }
                }
              }
            }
          }
        })
      ]);

      const totalStudentsApplied = uniqueStudents.length;
      const admissionRate = totalApplications > 0 
        ? ((approvedApplications / totalApplications) * 100).toFixed(1)
        : '0';

      const schoolStatistics = schoolStats.map(school => {
        const totalSchoolApplications = school.majors.reduce((sum, major) => 
          sum + major.applications.length, 0);
        const approvedSchoolApplications = school.majors.reduce((sum, major) => 
          sum + major.applications.filter(app => app.status === 'APPROVED').length, 0);
        
        return {
          schoolId: school.id,
          schoolName: school.name,
          totalApplications: totalSchoolApplications,
          approvedApplications: approvedSchoolApplications,
          admissionRate: totalSchoolApplications > 0 
            ? ((approvedSchoolApplications / totalSchoolApplications) * 100).toFixed(1)
            : '0'
        };
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalApplications,
            approvedApplications,
            pendingApplications,
            rejectedApplications,
            totalStudentsApplied,
            overallAdmissionRate: `${admissionRate}%`
          },
          schoolStatistics
        }
      });

    } catch (error) {
      console.error('Error fetching admission statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admission statistics'
      });
    }
  }

  // Get real-time admission status updates
  static async getAdmissionUpdates(req: Request, res: Response): Promise<void> {
    try {
      const { since } = req.query;
      const sinceDate = since ? new Date(since as string) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

      const recentUpdates = await prisma.application.findMany({
        where: {
          updatedAt: {
            gte: sinceDate
          },
          NOT: {
            createdAt: {
              equals: prisma.application.fields.updatedAt // Exclude newly created applications
            }
          }
        },        include: {
          student: {
            include: {
              user: {
                select: {
                  fullName: true,
                  cccd: true
                }
              }
            }
          },
          major: {
            include: {
              school: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 100
      });      const updates = recentUpdates.map(app => ({
        applicationId: app.id,
        studentName: app.student.user.fullName,
        cccd: app.student.user.cccd,
        majorName: app.major.name,
        schoolName: app.major.school.name,
        newStatus: app.status,
        updatedAt: app.updatedAt,
        adminNotes: app.adminNote
      }));

      res.json({
        success: true,
        data: updates
      });

    } catch (error) {
      console.error('Error fetching admission updates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admission updates'
      });
    }
  }

  // Helper method to calculate cutoff scores for majors
  private static async calculateCutoffScores(majorIds: string[]): Promise<Map<string, { cutoffScore: number; rank?: number }>> {
    const cutoffData = new Map<string, { cutoffScore: number; rank?: number }>();

    for (const majorId of majorIds) {
      const major = await prisma.major.findUnique({
        where: { id: majorId },
        select: { quota: true }
      });

      if (!major) continue;

      const applications = await prisma.application.findMany({
        where: {
          majorId,
          status: 'APPROVED'
        },
        include: {
          student: {
            include: {              scores: {
                where: {
                  status: 'APPROVED'
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            }
          }
        }
      });

      const scoredApps = applications
        .map(app => {
          const latestScore = app.student.scores[0];
          if (!latestScore) return null;

          let totalScore = 0;
          const scores = latestScore.scores as any;

          if (latestScore.type === 'THPT') {
            totalScore = (scores.toan || 0) + (scores.ly || 0) + (scores.hoa || 0);
          } else if (latestScore.type === 'TRANSCRIPT') {
            const subjects = Object.values(scores).filter(score => typeof score === 'number') as number[];
            const average = subjects.length > 0 ? subjects.reduce((sum, score) => sum + score, 0) / subjects.length : 0;
            totalScore = average * 3;
          } else if (latestScore.type === 'ASSESSMENT') {
            totalScore = scores.total || scores.tongDiem || 0;
          }

          return { totalScore, studentId: app.student.id };
        })
        .filter(app => app !== null)
        .sort((a, b) => b!.totalScore - a!.totalScore);

      if (scoredApps.length >= major.quota && major.quota > 0) {
        const cutoffScore = scoredApps[major.quota - 1].totalScore;
        cutoffData.set(majorId, { cutoffScore });
      } else if (scoredApps.length > 0) {
        const cutoffScore = scoredApps[scoredApps.length - 1].totalScore;
        cutoffData.set(majorId, { cutoffScore });
      }
    }

    return cutoffData;
  }
}
