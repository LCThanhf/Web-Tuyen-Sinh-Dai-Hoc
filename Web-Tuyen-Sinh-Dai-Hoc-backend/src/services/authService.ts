import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, JWTPayload } from '../types';

const prisma = new PrismaClient();

export class AuthService {
  static async register(data: RegisterRequest) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { cccd: data.cccd },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.cccd === data.cccd) {
          throw new Error('CCCD already registered');
        }
        if (existingUser.email === data.email) {
          throw new Error('Email already registered');
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Determine role based on CCCD (admin if starts with 9)
      const role = data.cccd.startsWith('9') ? 'ADMIN' : 'STUDENT';

      // Create user
      const user = await prisma.user.create({
        data: {
          cccd: data.cccd,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: role
        }
      });

      // Create student profile if role is STUDENT
      if (role === 'STUDENT') {
        await prisma.student.create({
          data: {
            userId: user.id
          }
        });
      }

      // Generate JWT token
      const token = this.generateToken({
        userId: user.id,
        cccd: user.cccd,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          cccd: user.cccd,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(data: LoginRequest) {
    try {
      // Find user by CCCD
      const user = await prisma.user.findUnique({
        where: { cccd: data.cccd }
      });

      if (!user) {
        throw new Error('Invalid CCCD or password');
      }

      if (!user.isActive) {
        throw new Error('Account has been deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid CCCD or password');
      }

      // Generate JWT token
      const token = this.generateToken({
        userId: user.id,
        cccd: user.cccd,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          cccd: user.cccd,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
      payload as object,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d',
        issuer: 'tuyen-sinh-system'
      } as jwt.SignOptions
    );
  }

  static async verifyToken(token: string): Promise<JWTPayload> {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      
      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return decoded;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          cccd: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              dob: true,
              gender: true,
              address: true,
              city: true,
              district: true,
              highSchoolName: true,
              graduationYear: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId: string, updateData: { fullName?: string; email?: string; phone?: string }) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is being changed and if it conflicts with another user
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailConflict = await prisma.user.findUnique({
          where: { email: updateData.email }
        });

        if (emailConflict) {
          throw new Error('Email already in use by another account');
        }
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(updateData.fullName && { fullName: updateData.fullName }),
          ...(updateData.email && { email: updateData.email }),
          ...(updateData.phone && { phone: updateData.phone }),
        },
        select: {
          id: true,
          cccd: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}