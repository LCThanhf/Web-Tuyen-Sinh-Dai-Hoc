# Production Deployment Guide

## Environment Files Created

I've created production-ready environment files for your deployment:

### Backend Environment Files:
- `.env.production` - Production environment variables
- `.env.development` - Development environment variables (maintains current setup)

### Frontend Environment Files:
- `.env.production` - Production environment variables  
- `.env.development` - Development environment variables

## Pre-Deployment Checklist

### 1. Database Setup
- [ ] Set up production database (PostgreSQL/MySQL recommended)
- [ ] Update `DATABASE_URL` in `.env.production`
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Seed initial data if needed

### 2. Security Configuration
- [ ] Generate strong JWT secret: `openssl rand -base64 64`
- [ ] Update `JWT_SECRET` in `.env.production`
- [ ] Configure CORS origins with your production domain
- [ ] Set up SSL/TLS certificates

### 3. Frontend Configuration
- [ ] Update `VITE_API_BASE_URL` in `.env.production` with your backend URL
- [ ] Build frontend for production: `npm run build`

### 4. Server Configuration
- [ ] Install PM2 or similar process manager
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up domain and DNS
- [ ] Configure firewall and security groups

## Quick Deployment Commands

### Backend Deployment:
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Build TypeScript
npm run build

# Start with production environment
NODE_ENV=production npm start
```

### Frontend Deployment:
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Serve built files (using serve package)
npx serve -s dist -l 3000
```

## Environment Variables Summary

### Critical Variables to Update:
1. **DATABASE_URL** - Your production database connection string
2. **JWT_SECRET** - Strong secret key (min 64 characters)
3. **FRONTEND_URL** - Your production domain for CORS
4. **VITE_API_BASE_URL** - Your backend API URL

### Example Production URLs:
- Backend API: `https://api.yourdomain.com`
- Frontend: `https://yourdomain.com`

## Additional Production Considerations

### 1. Monitoring & Logging
- Set up application monitoring (PM2, New Relic, etc.)
- Configure log aggregation
- Set up error tracking (Sentry, etc.)

### 2. Performance
- Enable gzip compression
- Set up CDN for static assets
- Configure caching headers
- Optimize database queries

### 3. Security
- Enable HTTPS everywhere
- Set up rate limiting
- Configure security headers
- Regular security updates

### 4. Backup & Recovery
- Set up database backups
- Document recovery procedures
- Test backup restoration

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check FRONTEND_URL in backend .env
2. **Database connection**: Verify DATABASE_URL format
3. **API not found**: Ensure VITE_API_BASE_URL is correct
4. **Authentication issues**: Check JWT_SECRET configuration

### Debug Commands:
```bash
# Check backend health
curl https://api.yourdomain.com/api/health

# View backend logs
pm2 logs

# Check environment variables
echo $NODE_ENV
```
