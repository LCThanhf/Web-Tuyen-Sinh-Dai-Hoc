import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateRegister = [
  body('cccd')
    .isLength({ min: 9, max: 12 })
    .matches(/^[0-9]+$/)
    .withMessage('CCCD must be 9-12 digits'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be 2-100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Phone must be 10-11 digits'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
];

export const validateLogin = [
  body('cccd')
    .isLength({ min: 9, max: 12 })
    .matches(/^[0-9]+$/)
    .withMessage('CCCD must be 9-12 digits'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validatePersonalInfo = [
  body('dob').isISO8601().withMessage('Invalid date format'),
  body('gender').isIn(['MALE', 'FEMALE']).withMessage('Invalid gender'),
  body('cccdIssuePlace').notEmpty().withMessage('CCCD issue place is required'),
  body('cccdIssueDate').isISO8601().withMessage('Invalid date format'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('highSchoolName').notEmpty().withMessage('High school name is required'),
  body('graduationYear').isInt({ min: 2000, max: 2030 }).withMessage('Invalid graduation year'),
  handleValidationErrors
];

export const validateScore = [
  body('type').isIn(['THPT', 'TRANSCRIPT', 'ASSESSMENT']).withMessage('Invalid score type'),
  body('scores').isObject().withMessage('Scores must be an object'),
  handleValidationErrors
];

export const validatePriority = [
  body('priorityArea').notEmpty().withMessage('Priority area is required'),
  body('priorityObject').notEmpty().withMessage('Priority object is required'),
  handleValidationErrors
];