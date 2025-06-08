import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterRequest, LoginRequest, AuthResponse, AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterRequest = req.body;
      
      const result = await AuthService.register(registerData);
      
      const response: AuthResponse = {
        success: true,
        message: 'Registration successful',
        data: result
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let statusCode = 500;
      let message = 'Internal server error';

      if (error.message.includes('already registered')) {
        statusCode = 409;
        message = error.message;
      } else if (error.message.includes('validation')) {
        statusCode = 400;
        message = error.message;
      }

      const response: AuthResponse = {
        success: false,
        message: message
      };

      res.status(statusCode).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      
      const result = await AuthService.login(loginData);
      
      const response: AuthResponse = {
        success: true,
        message: 'Login successful',
        data: result
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('Login error:', error);
      
      let statusCode = 500;
      let message = 'Internal server error';

      if (error.message.includes('Invalid') || error.message.includes('password')) {
        statusCode = 401;
        message = 'Invalid CCCD or password';
      } else if (error.message.includes('deactivated')) {
        statusCode = 403;
        message = 'Account has been deactivated';
      }

      const response: AuthResponse = {
        success: false,
        message: message
      };

      res.status(statusCode).json(response);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const user = await AuthService.getUserById(req.user.userId);
      
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user }
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // In a stateless JWT system, logout is typically handled on the frontend
      // by removing the token from storage. However, we can log the action.
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async refreshToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Generate a new token
      const newToken = AuthService.generateToken({
        userId: req.user.userId,
        cccd: req.user.cccd,
        role: req.user.role
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { token: newToken }
      });
    } catch (error: any) {
      console.error('Refresh token error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}