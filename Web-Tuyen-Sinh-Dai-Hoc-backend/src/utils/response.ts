import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, message: string, data?: any, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }
}