# StoryVerse Deployment Guide

This guide covers deploying the StoryVerse application to production environments.

## Prerequisites

- Docker (optional, for containerized deployment)
- PostgreSQL database (production instance)
- OpenAI API key (for AI features)
- Domain name (optional)
- SSL certificate (recommended)

## Environment Variables

### Backend (.env)

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_here

# AI Integration
AI_API_KEY=your_openai_api_key_here

# CORS (adjust for your frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend

Update the API base URL in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

## Deployment Options

### Option 1: Traditional Server Deployment

#### Backend Deployment

1. **Prepare the server:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   ```

2. **Set up the database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE storyverse;
   CREATE USER storyverse_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE storyverse TO storyverse_user;
   \q
   
   # Import schema
   psql -U storyverse_user -d storyverse -f backend/database/schema.sql
   ```

3. **Deploy backend code:**
   ```bash
   # Copy backend code to server
   scp -r backend/ user@server:/var/www/storyverse/
   
   # On the server
   cd /var/www/storyverse/backend
   npm install --production
   
   # Set up environment variables
   nano .env
   # Add your production environment variables
   ```

4. **Set up process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name storyverse-api
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/storyverse-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.your-domain.com
   ```

#### Frontend Deployment (React Native Web)

1. **Build for web:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to web server:**
   ```bash
   # Copy build files
   scp -r web-build/ user@server:/var/www/storyverse/frontend/
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/storyverse/frontend/web-build;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

#### Mobile App Deployment

For iOS and Android, follow the standard Expo/React Native build process:

1. **iOS (requires Mac):**
   ```bash
   expo build:ios
   # Follow prompts to configure app signing
   # Upload to App Store Connect
   ```

2. **Android:**
   ```bash
   expo build:android
   # Generate APK or AAB
   # Upload to Google Play Console
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile for backend:**

   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install --production
   
   COPY . .
   
   EXPOSE 3000
   
   CMD ["node", "src/server.js"]
   ```

2. **Create docker-compose.yml:**

   ```yaml
   version: '3.8'
   
   services:
     postgres:
       image: postgres:14-alpine
       environment:
         POSTGRES_DB: storyverse
         POSTGRES_USER: storyverse_user
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
       ports:
         - "5432:5432"
     
     backend:
       build: ./backend
       ports:
         - "3000:3000"
       environment:
         DATABASE_URL: postgresql://storyverse_user:${DB_PASSWORD}@postgres:5432/storyverse
         JWT_SECRET: ${JWT_SECRET}
         AI_API_KEY: ${AI_API_KEY}
         NODE_ENV: production
       depends_on:
         - postgres
       restart: unless-stopped
   
   volumes:
     postgres_data:
   ```

3. **Deploy with Docker:**
   ```bash
   # Create .env file with secrets
   echo "DB_PASSWORD=your_password" > .env
   echo "JWT_SECRET=your_jwt_secret" >> .env
   echo "AI_API_KEY=your_api_key" >> .env
   
   # Build and run
   docker-compose up -d
   ```

### Option 3: Cloud Platform Deployment

#### Heroku

1. **Backend:**
   ```bash
   cd backend
   heroku create storyverse-api
   heroku addons:create heroku-postgresql:hobby-dev
   heroku config:set JWT_SECRET=your_secret
   heroku config:set AI_API_KEY=your_api_key
   git push heroku main
   ```

2. **Database setup:**
   ```bash
   heroku pg:psql < database/schema.sql
   ```

#### Vercel (Frontend)

1. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

#### AWS (Comprehensive)

- **Backend**: Deploy to EC2 or ECS
- **Database**: Use RDS for PostgreSQL
- **Frontend**: Deploy to S3 + CloudFront
- **API Gateway**: Use for API management
- **Load Balancer**: Use ELB for high availability

#### DigitalOcean

1. **Use App Platform:**
   - Connect your GitHub repository
   - Configure build settings
   - Add environment variables
   - Deploy automatically on push

## Database Migrations

For production database updates:

```bash
# Backup first
pg_dump -U storyverse_user storyverse > backup.sql

# Apply migrations
psql -U storyverse_user storyverse < migrations/001_new_feature.sql
```

## Monitoring and Maintenance

### Health Checks

Add a health check endpoint to your backend:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
```

### Logging

Use a logging service like:
- Loggly
- Papertrail
- CloudWatch (AWS)
- Stackdriver (GCP)

### Monitoring Tools

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Error tracking**: Sentry

### Backup Strategy

```bash
# Automated daily backups
0 2 * * * pg_dump -U storyverse_user storyverse > /backups/storyverse_$(date +\%Y\%m\%d).sql
```

## Security Checklist

- [ ] Use HTTPS/SSL certificates
- [ ] Set secure JWT_SECRET (at least 32 characters)
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for secrets
- [ ] Regularly update dependencies
- [ ] Implement rate limiting
- [ ] Use prepared statements for database queries
- [ ] Sanitize user inputs
- [ ] Regular security audits
- [ ] Database backups
- [ ] Monitor for unusual activity

## Performance Optimization

1. **Database:**
   - Enable connection pooling
   - Add appropriate indexes
   - Use query optimization
   - Regular VACUUM on PostgreSQL

2. **Backend:**
   - Enable gzip compression
   - Implement caching (Redis)
   - Use CDN for static assets
   - Optimize API responses

3. **Frontend:**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Minimize bundle size

## Scaling Considerations

As your application grows:

1. **Horizontal scaling**: Add more backend instances
2. **Load balancing**: Distribute traffic across instances
3. **Database replication**: Set up read replicas
4. **Caching layer**: Implement Redis for session management
5. **Message queue**: Use RabbitMQ or AWS SQS for async tasks
6. **Microservices**: Consider splitting into smaller services

## Troubleshooting

### Backend won't start
- Check environment variables
- Verify database connection
- Check logs: `pm2 logs storyverse-api`

### Database connection issues
- Verify DATABASE_URL
- Check firewall rules
- Ensure PostgreSQL is running

### AI features not working
- Verify AI_API_KEY is set
- Check API quota/limits
- Review error logs

## Support

For deployment issues, check:
- GitHub Issues
- API Documentation
- Community Discord/Slack

## Rollback Plan

If deployment fails:

```bash
# PM2
pm2 restart storyverse-api --update-env

# Docker
docker-compose down
docker-compose up -d

# Database
psql -U storyverse_user storyverse < backup.sql
```