import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export class AdminController {
  // School Management
 static async createSchool(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, code, totalQuota, admissionMethods } = req.body;

 const normalizedName = name.trim().normalize('NFC');
    
    console.log('Creating school with name:', normalizedName);
    console.log('Name length:', normalizedName.length);

    // Remove the unique name check - allow similar names
    // We only need to ensure codes are unique

    // Generate unique code if provided code already exists
    let finalCode = code;
    let counter = 1;
    
    while (true) {
      const existingSchoolByCode = await prisma.school.findUnique({
        where: { code: finalCode }
      });
      
      if (!existingSchoolByCode) {
        break; // Code is unique
      }
      
      // Add number suffix to make it unique
      finalCode = `${code}${counter}`;
      counter++;
      
      // Safety check to prevent infinite loop
      if (counter > 999) {
        res.status(500).json({
          success: false,
          message: 'Unable to generate unique school code'
        });
        return;
      }
    }

      // Create school with admission methods
    const school = await prisma.school.create({
      data: {
        name: normalizedName,
        code: finalCode,
        totalQuota: totalQuota || 0,
        admissionMethods: {
          create: admissionMethods || []
        }
      },
      include: {
        admissionMethods: true,
        majors: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    });
  } catch (error: any) {
    console.error('Create school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create school'
    });
  }
}

  static async getSchools(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const schools = await prisma.school.findMany({
        include: {
          admissionMethods: true,
          majors: {
            include: {
              combinations: {
                include: {
                  combination: true
                }
              }
            }
          },
          _count: {
            select: {
              majors: true,
              applications: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json({
        success: true,
        data: schools
      });
    } catch (error: any) {
      console.error('Get schools error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools'
      });
    }
  }

  static async getSchool(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const school = await prisma.school.findUnique({
        where: { id },
        include: {
          majors: true,
          admissionMethods: true,
          _count: {
            select: { applications: true }
          }
        }
      });

      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      res.json({
        success: true,
        data: school
      });
    } catch (error: any) {
      console.error('Get school error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch school'
      });
    }
  }

 static async updateSchool(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, code, totalQuota, admissionMethods } = req.body;

    // Check if school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id }
    });

    if (!existingSchool) {
      res.status(404).json({
        success: false,
        message: 'School not found'
      });
      return;
    }

      

      // Generate unique code if provided code conflicts with other schools
      let finalCode = code;
      let counter = 1;
      
      if (code !== existingSchool.code) {
        while (true) {
          const codeConflict = await prisma.school.findFirst({
            where: { 
              code: finalCode,
              id: { not: id } // Exclude current school
            }
          });
          
          if (!codeConflict) {
            break; // Code is unique
          }
          
          // Add number suffix to make it unique
          finalCode = `${code}${counter}`;
          counter++;
          
          // Safety check
          if (counter > 999) {
            res.status(500).json({
              success: false,
              message: 'Unable to generate unique school code'
            });
            return;
          }
        }
      }

      // Update school
    const school = await prisma.school.update({
      where: { id },
      data: {
        name: name.trim().normalize('NFC'),
        code: finalCode,
        totalQuota: totalQuota || 0,
        admissionMethods: {
          deleteMany: {},
          create: admissionMethods || []
        }
      },
      include: {
        admissionMethods: true,
        majors: true
      }
    });

    res.json({
      success: true,
      message: 'School updated successfully',
      data: school
    });
  } catch (error: any) {
    console.error('Update school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update school'
    });
  }
}

  static async deleteSchool(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if school exists
      const school = await prisma.school.findUnique({
        where: { id },
        include: {
          majors: true,
          applications: true
        }
      });

      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Check if school has applications
      if (school.applications.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete school with existing applications'
        });
        return;
      }

      // Delete school (cascades to majors and admission methods)
      await prisma.school.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'School deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete school error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete school'
      });
    }
  }

  // Major Management
  static async createMajor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, code, schoolId, quota, admissionCombinationIds } = req.body;

      // Check if major code already exists
      const existingMajor = await prisma.major.findUnique({
        where: { code }
      });

      if (existingMajor) {
        res.status(409).json({
          success: false,
          message: 'Major code already exists'
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

      // Create major with combinations
      const major = await prisma.major.create({
        data: {
          name,
          code,
          schoolId,
          quota,
          combinations: {
            create: admissionCombinationIds?.map((combinationId: string) => ({
              combinationId
            })) || []
          }
        },
        include: {
          school: true,
          combinations: {
            include: {
              combination: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Major created successfully',
        data: major
      });
    } catch (error: any) {
      console.error('Create major error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create major'
      });
    }
  }

  static async getMajors(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { schoolId } = req.query;

      const whereClause = schoolId ? { schoolId: schoolId as string } : {};

      const majors = await prisma.major.findMany({
        where: whereClause,
        include: {
          school: true,
          combinations: {
            include: {
              combination: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json({
        success: true,
        data: majors
      });
    } catch (error: any) {
      console.error('Get majors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch majors'
      });
    }
  }

  static async getMajor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const major = await prisma.major.findUnique({
        where: { id },
        include: {
          school: true,
          combinations: {
            include: {
              combination: true
            }
          },
          _count: {
            select: { applications: true }
          }
        }
      });

      if (!major) {
        res.status(404).json({
          success: false,
          message: 'Major not found'
        });
        return;
      }

      res.json({
        success: true,
        data: major
      });
    } catch (error: any) {
      console.error('Get major error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch major'
      });
    }
  }

  static async updateMajor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, code, schoolId, quota, admissionCombinationIds } = req.body;

      // Check if major exists
      const existingMajor = await prisma.major.findUnique({
        where: { id }
      });

      if (!existingMajor) {
        res.status(404).json({
          success: false,
          message: 'Major not found'
        });
        return;
      }

      // Check if code is being changed and if it conflicts
      if (code !== existingMajor.code) {
        const codeConflict = await prisma.major.findUnique({
          where: { code }
        });

        if (codeConflict) {
          res.status(409).json({
            success: false,
            message: 'Major code already exists'
          });
          return;
        }
      }

      // Update major
      const major = await prisma.major.update({
        where: { id },
        data: {
          name,
          code,
          schoolId,
          quota,
          combinations: {
            deleteMany: {},
            create: admissionCombinationIds?.map((combinationId: string) => ({
              combinationId
            })) || []
          }
        },
        include: {
          school: true,
          combinations: {
            include: {
              combination: true
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Major updated successfully',
        data: major
      });
    } catch (error: any) {
      console.error('Update major error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update major'
      });
    }
  }

  static async deleteMajor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if major exists and has applications
      const major = await prisma.major.findUnique({
        where: { id },
        include: {
          applications: true
        }
      });

      if (!major) {
        res.status(404).json({
          success: false,
          message: 'Major not found'
        });
        return;
      }

      if (major.applications.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete major with existing applications'
        });
        return;
      }

      // Delete major (cascades to combinations)
      await prisma.major.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Major deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete major error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete major'
      });
    }
  }

  // Admission Combination Management
  static async createAdmissionCombination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, subjects } = req.body;

      // Check if combination name already exists
      const existingCombination = await prisma.admissionCombination.findUnique({
        where: { name }
      });

      if (existingCombination) {
        res.status(409).json({
          success: false,
          message: 'Admission combination name already exists'
        });
        return;
      }

      const combination = await prisma.admissionCombination.create({
        data: {
          name,
          subjects
        }
      });

      res.status(201).json({
        success: true,
        message: 'Admission combination created successfully',
        data: combination
      });
    } catch (error: any) {
      console.error('Create admission combination error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create admission combination'
      });
    }
  }

  static async getAdmissionCombinations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const combinations = await prisma.admissionCombination.findMany({
        include: {
          majors: {
            include: {
              major: {
                include: {
                  school: true
                }
              }
            }
          },
          _count: {
            select: {
              majors: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json({
        success: true,
        data: combinations
      });
    } catch (error: any) {
      console.error('Get admission combinations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admission combinations'
      });
    }
  }

  static async getCombination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const combination = await prisma.admissionCombination.findUnique({
        where: { id },
        include: {
          majors: {
            include: {
              major: {
                include: {
                  school: true
                }
              }
            }
          }
        }
      });

      if (!combination) {
        res.status(404).json({
          success: false,
          message: 'Admission combination not found'
        });
        return;
      }

      res.json({
        success: true,
        data: combination
      });
    } catch (error: any) {
      console.error('Get combination error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admission combination'
      });
    }
  }

  // Alias methods for cleaner route names
  static async createCombination(req: AuthenticatedRequest, res: Response): Promise<void> {
    return AdminController.createAdmissionCombination(req, res);
  }

  static async getCombinations(req: AuthenticatedRequest, res: Response): Promise<void> {
    return AdminController.getAdmissionCombinations(req, res);
  }

  static async updateCombination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, subjects } = req.body;

      // Check if combination exists
      const existingCombination = await prisma.admissionCombination.findUnique({
        where: { id }
      });

      if (!existingCombination) {
        res.status(404).json({
          success: false,
          message: 'Admission combination not found'
        });
        return;
      }

      // Check if name is being changed and if it conflicts
      if (name !== existingCombination.name) {
        const nameConflict = await prisma.admissionCombination.findUnique({
          where: { name }
        });

        if (nameConflict) {
          res.status(409).json({
            success: false,
            message: 'Admission combination name already exists'
          });
          return;
        }
      }

      const combination = await prisma.admissionCombination.update({
        where: { id },
        data: {
          name,
          subjects
        },
        include: {
          majors: {
            include: {
              major: {
                include: {
                  school: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Admission combination updated successfully',
        data: combination
      });
    } catch (error: any) {
      console.error('Update admission combination error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update admission combination'
      });
    }
  }

  static async deleteCombination(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if combination exists
      const existingCombination = await prisma.admissionCombination.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              majors: true
            }
          }
        }
      });

      if (!existingCombination) {
        res.status(404).json({
          success: false,
          message: 'Admission combination not found'
        });
        return;
      }

      // Check if combination is being used by any majors
      if (existingCombination._count.majors > 0) {
        res.status(409).json({
          success: false,
          message: 'Cannot delete combination that is assigned to majors'
        });
        return;
      }

      await prisma.admissionCombination.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Admission combination deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete admission combination error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete admission combination'
      });
    }
  }

  // Major-Combination Assignment Methods
  static async assignCombinationToMajor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { majorId, combinationId } = req.params;

      // Check if major and combination exist
      const [major, combination] = await Promise.all([
        prisma.major.findUnique({ where: { id: majorId } }),
        prisma.admissionCombination.findUnique({ where: { id: combinationId } })
      ]);

      if (!major) {
        res.status(404).json({
          success: false,
          message: 'Major not found'
        });
        return;
      }

      if (!combination) {
        res.status(404).json({
          success: false,
          message: 'Admission combination not found'
        });
        return;
      }

      // Check if assignment already exists
      const existingAssignment = await prisma.majorCombination.findUnique({
        where: {
          majorId_combinationId: {
            majorId,
            combinationId
          }
        }
      });

      if (existingAssignment) {
        res.status(400).json({
          success: false,
          message: 'Combination is already assigned to this major'
        });
        return;
      }

      // Create the assignment
      await prisma.majorCombination.create({
        data: {
          majorId,
          combinationId
        }
      });

      res.json({
        success: true,
        message: 'Combination assigned to major successfully'
      });
    } catch (error: any) {
      console.error('Assign combination error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign combination to major'
      });
    }
  }

  static async removeCombinationFromMajor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { majorId, combinationId } = req.params;

      const assignment = await prisma.majorCombination.findUnique({
        where: {
          majorId_combinationId: {
            majorId,
            combinationId
          }
        }
      });

      if (!assignment) {
        res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
        return;
      }

      await prisma.majorCombination.delete({
        where: {
          majorId_combinationId: {
            majorId,
            combinationId
          }
        }
      });

      res.json({
        success: true,
        message: 'Combination removed from major successfully'
      });
    } catch (error: any) {
      console.error('Remove combination error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove combination from major'
      });
    }
  }

  static async getMajorCombinations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { majorId } = req.params;

      const major = await prisma.major.findUnique({
        where: { id: majorId },
        include: {
          combinations: {
            include: {
              combination: true
            }
          }
        }
      });

      if (!major) {
        res.status(404).json({
          success: false,
          message: 'Major not found'
        });
        return;
      }

      res.json({
        success: true,
        data: major.combinations.map(mc => mc.combination)
      });
    } catch (error: any) {
      console.error('Get major combinations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch major combinations'
      });
    }
  }

  // Student Management
  static async getStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      
      if (search) {
        whereClause.OR = [
          { user: { fullName: { contains: search as string, mode: 'insensitive' } } },
          { user: { cccd: { contains: search as string } } },
          { user: { email: { contains: search as string, mode: 'insensitive' } } }
        ];
      }

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                cccd: true,
                fullName: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true
              }
            },
            personalInfo: true,
            scores: true,
            priorities: true,
            achievements: true,
            certificates: true,
            applications: {
              include: {
                school: true,
                major: true
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.student.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: {
          students,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error: any) {
      console.error('Get students error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch students'
      });
    }
  }

  static async getStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              cccd: true,
              fullName: true,
              email: true,
              phone: true,
              role: true,
              isActive: true,
              createdAt: true
            }
          },
          personalInfo: true,
          scores: true,
          priorities: true,
          achievements: true,
          certificates: true,
          applications: {
            include: {
              school: true,
              major: true
            }
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

      res.json({
        success: true,
        data: student
      });
    } catch (error: any) {
      console.error('Get student error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student'
      });
    }
  }

  // Document Approval System
  static async getPendingDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type } = req.query;

      let pendingDocs: any[] = [];

      if (!type || type === 'personal') {
        const personalDocs = await prisma.personalInfo.findMany({
          where: { status: 'PENDING' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    cccd: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        });
        pendingDocs.push(...personalDocs.map(doc => ({ ...doc, type: 'personal' })));
      }

      if (!type || type === 'scores') {
        const scoreDocs = await prisma.score.findMany({
          where: { status: 'PENDING' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    cccd: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        });
        pendingDocs.push(...scoreDocs.map(doc => ({ ...doc, type: 'scores' })));
      }

      if (!type || type === 'priority') {
        const priorityDocs = await prisma.priority.findMany({
          where: { status: 'PENDING' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    cccd: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        });
        pendingDocs.push(...priorityDocs.map(doc => ({ ...doc, type: 'priority' })));
      }

      if (!type || type === 'achievement') {
        const achievementDocs = await prisma.achievement.findMany({
          where: { status: 'PENDING' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    cccd: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        });
        pendingDocs.push(...achievementDocs.map(doc => ({ ...doc, type: 'achievement' })));
      }

      if (!type || type === 'certificate') {
        const certificateDocs = await prisma.certificate.findMany({
          where: { status: 'PENDING' },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    cccd: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        });
        pendingDocs.push(...certificateDocs.map(doc => ({ ...doc, type: 'certificate' })));
      }

      // Sort all documents by creation date
      pendingDocs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      res.json({
        success: true,
        data: pendingDocs
      });
    } catch (error: any) {
      console.error('Get pending documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending documents'
      });
    }
  }

  static async approveDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type, id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const updateData = {
        status: 'APPROVED' as any,
        adminNote: adminNote || null,
        reviewedAt: new Date(),
        reviewedBy: adminId
      };

      let updatedDoc;

      switch (type) {
        case 'personal':
          updatedDoc = await prisma.personalInfo.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'scores':
          updatedDoc = await prisma.score.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'priority':
          updatedDoc = await prisma.priority.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'achievement':
          updatedDoc = await prisma.achievement.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'certificate':
          updatedDoc = await prisma.certificate.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        default:
          res.status(400).json({
            success: false,
            message: 'Invalid document type'
          });
          return;
      }

      res.json({
        success: true,
        message: 'Document approved successfully',
        data: updatedDoc
      });
    } catch (error: any) {
      console.error('Approve document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve document'
      });
    }
  }

  static async rejectDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type, id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      if (!adminNote || adminNote.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'Admin note is required for rejection'
        });
        return;
      }

      const updateData = {
        status: 'REJECTED' as any,
        adminNote,
        reviewedAt: new Date(),
        reviewedBy: adminId
      };

      let updatedDoc;

      switch (type) {
        case 'personal':
          updatedDoc = await prisma.personalInfo.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'scores':
          updatedDoc = await prisma.score.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'priority':
          updatedDoc = await prisma.priority.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'achievement':
          updatedDoc = await prisma.achievement.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        case 'certificate':
          updatedDoc = await prisma.certificate.update({
            where: { id },
            data: updateData,
            include: {
              student: {
                include: {
                  user: {
                    select: { fullName: true, cccd: true }
                  }
                }
              }
            }
          });
          break;
        default:
          res.status(400).json({
            success: false,
            message: 'Invalid document type'
          });
          return;
      }

      res.json({
        success: true,
        message: 'Document rejected successfully',
        data: updatedDoc
      });
    } catch (error: any) {
      console.error('Reject document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject document'
      });
    }
  }

  // Application Management
  static async getApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, schoolId, majorId, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      
      if (schoolId) whereClause.schoolId = schoolId;
      if (majorId) whereClause.majorId = majorId;
      if (status) whereClause.status = status;

      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where: whereClause,
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    cccd: true,
                    email: true,
                    phone: true
                  }
                }
              }
            },
            school: true,
            major: true
          },
          skip,
          take: Number(limit),
          orderBy: [
            { priorityOrder: 'asc' },
            { submissionDate: 'asc' }
          ]
        }),
        prisma.application.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: {
          applications,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error: any) {
      console.error('Get applications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications'
      });
    }
  }

  static async approveApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const application = await prisma.application.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: { fullName: true, cccd: true }
              }
            }
          },
          school: true,
          major: true
        }
      });

      res.json({
        success: true,
        message: 'Application approved successfully',
        data: application
      });
    } catch (error: any) {
      console.error('Approve application error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve application'
      });
    }
  }

  static async rejectApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      if (!adminNote || adminNote.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'Admin note is required for rejection'
        });
        return;
      }

      const application = await prisma.application.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNote,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: { fullName: true, cccd: true }
              }
            }
          },
          school: true,
          major: true
        }
      });

      res.json({
        success: true,
        message: 'Application rejected successfully',
        data: application
      });
    } catch (error: any) {
      console.error('Reject application error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject application'
      });
    }
  }

  // Document-specific methods for admin routes compatibility
 // ...existing code...
  static async getPersonalInfoDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status = 'PENDING' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const documents = await prisma.personalInfo.findMany({
        where: {
          status: status as any,
        },
        include: {
          student: {
            select: {
              id: true,
              dob: true,
              gender: true,
              cccdIssuePlace: true,
              cccdIssueDate: true,
              address: true,
              city: true,
              district: true,
              highSchoolName: true,
              graduationYear: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  cccd: true,
                }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      const total = await prisma.personalInfo.count({
        where: { status: status as any }
      });

      res.json({
        success: true,
        data: {
          documents,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error fetching personal info documents:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching personal info documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
// ...existing code...

  static async approvePersonalInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.personalInfo.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Personal info approved successfully',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving personal info',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async rejectPersonalInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.personalInfo.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNote,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Personal info rejected',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting personal info',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getScoreDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status = 'PENDING' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const documents = await prisma.score.findMany({
        where: {
          status: status as any,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  cccd: true,
                }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      const total = await prisma.score.count({
        where: { status: status as any }
      });

      // Transform documents to include fileUrls for frontend compatibility
      const transformedDocuments = documents.map(doc => ({
        ...doc,
        fileUrls: Array.isArray(doc.files) ? doc.files : []
      }));

      res.json({
        success: true,
        data: {
          documents: transformedDocuments,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching score documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async approveScores(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.score.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Scores approved successfully',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving scores',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async rejectScores(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.score.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNote,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Scores rejected',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting scores',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getPriorityDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status = 'PENDING' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const documents = await prisma.priority.findMany({
        where: {
          status: status as any,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  cccd: true,
                }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      const total = await prisma.priority.count({
        where: { status: status as any }
      });

      res.json({
        success: true,
        data: {
          documents,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching priority documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async approvePriority(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.priority.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Priority approved successfully',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving priority',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async rejectPriority(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.priority.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNote,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Priority rejected',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting priority',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getAchievementDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status = 'PENDING' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const documents = await prisma.achievement.findMany({
        where: {
          status: status as any,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  cccd: true,
                }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      const total = await prisma.achievement.count({
        where: { status: status as any }
      });

      res.json({
        success: true,
        data: {
          documents,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching achievement documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async approveAchievement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.achievement.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Achievement approved successfully',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving achievement',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async rejectAchievement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.achievement.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNote,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Achievement rejected',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting achievement',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getCertificateDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status = 'PENDING' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const documents = await prisma.certificate.findMany({
        where: {
          status: status as any,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  cccd: true,
                }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      const total = await prisma.certificate.count({
        where: { status: status as any }
      });

      res.json({
        success: true,
        data: {
          documents,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching certificate documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async approveCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.certificate.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminNote: adminNote || null,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Certificate approved successfully',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving certificate',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async rejectCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user!.userId;

      const document = await prisma.certificate.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminNote,
          reviewedAt: new Date(),
          reviewedBy: adminId
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Certificate rejected',
        data: document
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting certificate',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}