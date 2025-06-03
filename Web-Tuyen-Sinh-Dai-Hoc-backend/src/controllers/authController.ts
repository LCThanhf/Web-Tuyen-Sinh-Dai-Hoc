import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      fullName,
      citizenId,
      phone,
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      ApiResponse.error(res, 'Email already registered', 400);
      return;
    }

    // Check if citizen ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { citizenId }
    });

    if (existingStudent) {
      ApiResponse.error(res, 'Citizen ID already registered', 400);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and student in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'STUDENT'
        }
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          citizenId,
          fullName,
          email,
          phone,
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

      // Create initial personal info record
      await tx.personalInfo.create({
        data: {
          studentId: student.id,
          status: 'PENDING'
        }
      });

      return { user, student };
    });

    // Generate JWT token - Fixed version
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const token = jwt.sign(
      { 
        userId: result.user.id, 
        role: result.user.role 
      },
      jwtSecret,
      { 
        expiresIn: jwtExpiresIn 
      }
    );

    ApiResponse.success(res, 'Registration successful', {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      },
      student: {
        id: result.student.id,
        fullName: result.student.fullName,
        citizenId: result.student.citizenId
      }
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    ApiResponse.error(res, 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with related data
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        admin: true
      }
    });

    if (!user) {
      ApiResponse.error(res, 'Invalid credentials', 401);
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      ApiResponse.error(res, 'Invalid credentials', 401);
      return;
    }

    // Generate JWT token - Fixed version
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      },
      jwtSecret,
      { 
        expiresIn: jwtExpiresIn 
      }
    );

    // Update last login for admin
    if (user.role === 'ADMIN' && user.admin) {
      await prisma.admin.update({
        where: { id: user.admin.id },
        data: { lastLogin: new Date() }
      });
    }

    ApiResponse.success(res, 'Login successful', {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase()
      },
      profile: user.role === 'STUDENT' ? user.student : user.admin
    });

  } catch (error) {
    console.error('Login error:', error);
    ApiResponse.error(res, 'Login failed', 500);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      ApiResponse.error(res, 'Token is required', 400);
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    const newToken = jwt.sign(
      { 
        userId: decoded.userId, 
        role: decoded.role 
      },
      jwtSecret,
      { 
        expiresIn: jwtExpiresIn 
      }
    );

    ApiResponse.success(res, 'Token refreshed', { token: newToken });

  } catch (error) {
    ApiResponse.error(res, 'Invalid token', 401);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // For JWT, logout is handled on client side by removing token
  ApiResponse.success(res, 'Logout successful');
};