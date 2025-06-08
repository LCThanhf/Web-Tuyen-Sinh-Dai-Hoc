import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VirtualFilterRequest {
  schoolId?: string;
  majorId?: string;
  minScore?: number;
  maxResults?: number;
  simulationMode?: boolean;
}

interface AdmissionResult {
  studentId: string;
  studentName: string;
  cccd: string;
  totalScore: number;
  majorId: string;
  majorName: string;
  schoolId: string;
  schoolName: string;
  priorityOrder: number;
  admissionStatus: 'ADMITTED' | 'WAITLIST' | 'REJECTED';
  rank: number;
}

export class VirtualFilterController {
  // Main virtual filtering endpoint - simulates admission process
  static async runVirtualFilter(req: Request, res: Response): Promise<void> {
    try {
      const {
        schoolId,
        majorId,
        minScore = 0,
        maxResults = 1000,
        simulationMode = true
      }: VirtualFilterRequest = req.body;

      // Build filter conditions
      const whereConditions: any = {
        status: 'APPROVED' // Only consider approved applications
      };

      if (schoolId) {
        whereConditions.major = { schoolId };
      }
      if (majorId) {
        whereConditions.majorId = majorId;
      }

      // Get approved applications with student scores
      const applications = await prisma.application.findMany({
        where: whereConditions,
        include: {          student: {
            include: {
              user: {
                select: {
                  fullName: true,
                  cccd: true
                }
              },
              scores: {
                where: {
                  status: 'APPROVED'
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1 // Get latest approved score
              }
            }
          },
          major: {
            include: {
              school: true
            }
          }
        }
      });

      // Calculate total scores and filter by minimum score
      const scoredApplications = applications
        .map(app => {
          const latestScore = app.student.scores[0];
          if (!latestScore) return null;

          // Calculate total score based on score type
          let totalScore = 0;
          const scores = latestScore.scores as any;

          if (latestScore.type === 'THPT') {
            // THPT: Sum of three main subjects
            totalScore = (scores.toan || 0) + (scores.ly || 0) + (scores.hoa || 0);
          } else if (latestScore.type === 'TRANSCRIPT') {
            // Transcript: Average * 10 * 3 (to match THPT scale)
            const subjects = Object.values(scores).filter(score => typeof score === 'number') as number[];
            const average = subjects.length > 0 ? subjects.reduce((sum, score) => sum + score, 0) / subjects.length : 0;
            totalScore = average * 3;
          } else if (latestScore.type === 'ASSESSMENT') {
            // Assessment: Use provided total or calculate
            totalScore = scores.total || scores.tongDiem || 0;
          }          return {
            studentId: app.student.id,
            studentName: app.student.user.fullName,
            cccd: app.student.user.cccd,
            applicationId: app.id,
            totalScore,
            majorId: app.major.id,
            majorName: app.major.name,
            schoolId: app.major.school.id,
            schoolName: app.major.school.name,
            priorityOrder: app.priorityOrder,
            quota: app.major.quota
          };
        })
        .filter(app => app !== null && app.totalScore >= minScore)
        .sort((a, b) => b!.totalScore - a!.totalScore); // Sort by score descending

      // Group by major and apply quota filtering
      const resultsByMajor = new Map<string, any[]>();
      scoredApplications.forEach(app => {
        if (!app) return;
        
        const key = app.majorId;
        if (!resultsByMajor.has(key)) {
          resultsByMajor.set(key, []);
        }
        resultsByMajor.get(key)!.push(app);
      });

      // Apply admission logic for each major
      const admissionResults: AdmissionResult[] = [];
      
      for (const [majorId, majorApplications] of resultsByMajor) {
        const quota = majorApplications[0]?.quota || 0;
        
        majorApplications.forEach((app, index) => {
          let admissionStatus: 'ADMITTED' | 'WAITLIST' | 'REJECTED';
          
          if (index < quota) {
            admissionStatus = 'ADMITTED';
          } else if (index < quota * 1.5) { // 50% more for waitlist
            admissionStatus = 'WAITLIST';
          } else {
            admissionStatus = 'REJECTED';
          }

          admissionResults.push({
            studentId: app.studentId,
            studentName: app.studentName,
            cccd: app.cccd,
            totalScore: app.totalScore,
            majorId: app.majorId,
            majorName: app.majorName,
            schoolId: app.schoolId,
            schoolName: app.schoolName,
            priorityOrder: app.priorityOrder,
            admissionStatus,
            rank: index + 1
          });
        });
      }

      // If not simulation mode, actually update application statuses
      if (!simulationMode) {
        const updatePromises = admissionResults.map(result => {
          let newStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
          switch (result.admissionStatus) {
            case 'ADMITTED':
              newStatus = 'APPROVED';
              break;
            case 'WAITLIST':
              newStatus = 'PENDING';
              break;
            default:
              newStatus = 'REJECTED';
              break;
          }

          return prisma.application.updateMany({
            where: {
              studentId: result.studentId,
              majorId: result.majorId
            },
            data: {
              status: newStatus,
              adminNote: `Virtual filter result: ${result.admissionStatus} (Rank: ${result.rank}, Score: ${result.totalScore})`
            }
          });
        });

        await Promise.all(updatePromises);
      }

      // Limit results if specified
      const limitedResults = maxResults > 0 
        ? admissionResults.slice(0, maxResults)
        : admissionResults;

      // Generate summary statistics
      const summary = {
        totalProcessed: admissionResults.length,
        admitted: admissionResults.filter(r => r.admissionStatus === 'ADMITTED').length,
        waitlisted: admissionResults.filter(r => r.admissionStatus === 'WAITLIST').length,
        rejected: admissionResults.filter(r => r.admissionStatus === 'REJECTED').length,
        averageScore: admissionResults.length > 0 
          ? (admissionResults.reduce((sum, r) => sum + r.totalScore, 0) / admissionResults.length).toFixed(2)
          : '0',
        majorsProcessed: resultsByMajor.size
      };

      res.json({
        success: true,
        message: simulationMode ? 'Virtual filter simulation completed' : 'Virtual filter applied successfully',
        data: {
          results: limitedResults,
          summary,
          simulationMode
        }
      });

    } catch (error) {
      console.error('Error running virtual filter:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to run virtual filter'
      });
    }
  }

  // Get admission quotas and current fill status
  static async getAdmissionQuotas(req: Request, res: Response): Promise<void> {
    try {
      const { schoolId } = req.query;

      const whereConditions: any = {};
      if (schoolId) {
        whereConditions.schoolId = schoolId;
      }

      const majors = await prisma.major.findMany({
        where: whereConditions,
        include: {
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
          },
          _count: {
            select: {
              applications: true
            }
          }
        }
      });

      const quotaInfo = majors.map(major => {
        const approvedApplications = major.applications.filter(app => app.status === 'APPROVED').length;
        const pendingApplications = major.applications.filter(app => app.status === 'PENDING').length;
        const totalApplications = major._count.applications;
        
        return {
          majorId: major.id,
          majorName: major.name,
          majorCode: major.code,
          school: major.school,
          quota: major.quota,
          currentAdmitted: approvedApplications,
          currentPending: pendingApplications,
          totalApplications,
          availableSlots: Math.max(0, major.quota - approvedApplications),
          fillPercentage: major.quota > 0 ? ((approvedApplications / major.quota) * 100).toFixed(1) : '0',
          competitionRatio: major.quota > 0 ? (totalApplications / major.quota).toFixed(2) : '0'
        };
      });

      res.json({
        success: true,
        data: quotaInfo
      });

    } catch (error) {
      console.error('Error fetching admission quotas:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admission quotas'
      });
    }
  }

  // Get cut-off scores prediction based on current applications
  static async getCutoffPrediction(req: Request, res: Response): Promise<void> {
    try {
      const { majorId, schoolId } = req.query;

      let whereConditions: any = {
        status: 'APPROVED'
      };

      if (majorId) {
        whereConditions.majorId = majorId;
      } else if (schoolId) {
        whereConditions.major = { schoolId };
      }

      const applications = await prisma.application.findMany({
        where: whereConditions,        include: {
          student: {
            include: {
              user: {
                select: {
                  fullName: true,
                  cccd: true
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
        }
      });

      // Calculate scores and group by major
      const majorPredictions = new Map<string, any>();

      applications.forEach(app => {
        const latestScore = app.student.scores[0];
        if (!latestScore) return;

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

        const majorKey = app.major.id;
        if (!majorPredictions.has(majorKey)) {
          majorPredictions.set(majorKey, {
            majorId: app.major.id,
            majorName: app.major.name,
            schoolName: app.major.school.name,
            quota: app.major.quota,
            scores: []
          });
        }

        majorPredictions.get(majorKey).scores.push(totalScore);
      });

      // Calculate predictions for each major
      const predictions = Array.from(majorPredictions.values()).map(major => {
        const sortedScores = major.scores.sort((a: number, b: number) => b - a);
        const quota = major.quota;
        
        let predictedCutoff = 0;
        let minScore = Math.min(...sortedScores);
        let maxScore = Math.max(...sortedScores);
        let averageScore = sortedScores.length > 0 
          ? (sortedScores.reduce((sum: number, score: number) => sum + score, 0) / sortedScores.length).toFixed(2)
          : '0';

        if (sortedScores.length >= quota && quota > 0) {
          predictedCutoff = sortedScores[quota - 1];
        } else if (sortedScores.length > 0) {
          predictedCutoff = minScore;
        }

        return {
          majorId: major.majorId,
          majorName: major.majorName,
          schoolName: major.schoolName,
          quota: major.quota,
          totalApplications: sortedScores.length,
          predictedCutoff: predictedCutoff.toFixed(2),
          minScore: minScore.toFixed(2),
          maxScore: maxScore.toFixed(2),
          averageScore,
          competitionRatio: quota > 0 ? (sortedScores.length / quota).toFixed(2) : '0'
        };
      });

      res.json({
        success: true,
        data: predictions
      });

    } catch (error) {
      console.error('Error calculating cutoff predictions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate cutoff predictions'
      });
    }
  }

  // Simulate different quota scenarios
  static async simulateQuotaScenarios(req: Request, res: Response): Promise<void> {
    try {
      const { majorId, scenarios } = req.body;

      if (!majorId || !scenarios || !Array.isArray(scenarios)) {
        res.status(400).json({
          success: false,
          message: 'Major ID and scenarios array are required'
        });
        return;
      }

      // Get applications for the major
      const applications = await prisma.application.findMany({
        where: {
          majorId,
          status: 'APPROVED'
        },
        include: {          student: {
            include: {
              user: {
                select: {
                  fullName: true,
                  cccd: true
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
          },
          major: {
            select: {
              name: true,
              quota: true,
              school: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      // Calculate scores
      const scoredApplications = applications
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

          return {
            studentId: app.student.id,
            studentName: app.student.user.fullName,
            totalScore
          };
        })
        .filter(app => app !== null)
        .sort((a, b) => b!.totalScore - a!.totalScore);

      // Run simulations for each scenario
      const simulationResults = scenarios.map((scenario: { quota: number; description?: string }) => {
        const quota = scenario.quota;
        const admitted = scoredApplications.slice(0, quota);
        const cutoffScore = admitted.length > 0 ? admitted[admitted.length - 1].totalScore : 0;
        const averageAdmittedScore = admitted.length > 0 
          ? (admitted.reduce((sum, app) => sum + app.totalScore, 0) / admitted.length).toFixed(2)
          : '0';

        return {
          quota,
          description: scenario.description || `Quota: ${quota}`,
          admitted: admitted.length,
          cutoffScore: cutoffScore.toFixed(2),
          averageAdmittedScore,
          competitionRatio: quota > 0 ? (scoredApplications.length / quota).toFixed(2) : '0'
        };
      });

      res.json({
        success: true,
        data: {
          majorInfo: {
            id: majorId,
            name: applications[0]?.major.name || 'Unknown',
            schoolName: applications[0]?.major.school.name || 'Unknown',
            currentQuota: applications[0]?.major.quota || 0
          },
          totalApplications: scoredApplications.length,
          scenarios: simulationResults
        }
      });

    } catch (error) {
      console.error('Error simulating quota scenarios:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to simulate quota scenarios'
      });
    }
  }
}
