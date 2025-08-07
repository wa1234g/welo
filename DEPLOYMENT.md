# SnapBrander Deployment Guide

This guide provides comprehensive instructions for deploying the SnapBrander application to a cPanel hosting environment with complete cPanel integration for automated WordPress site creation.

## System Overview

SnapBrander is a comprehensive SaaS platform that enables automated WordPress website creation with AI-powered customization. The system includes:

- **Frontend**: Next.js application with React and Tailwind CSS
- **Backend**: FastAPI with SQLAlchemy and SQLite/PostgreSQL
- **cPanel Integration**: Automated subdomain and database creation
- **WordPress Management**: Automated installation, theme/plugin setup
- **AI Integration**: Content generation and customization
- **Payment Processing**: Paymob integration for Egyptian market

## Overview
This guide covers deploying SnapBrander to a cPanel hosting environment for production use.

## Prerequisites
- cPanel hosting account with API access
- Python 3.12+ support
- Node.js 18+ support
- MySQL database access
- SSL certificate capability
- Subdomain creation permissions

## Backend Deployment

### 1. Prepare the Server
```bash
# Upload backend files to your hosting account
# Typically in: public_html/api/ or a subdirectory

# Install Python dependencies
cd /path/to/snapbrander-backend
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
# Copy and configure environment variables
cp .env.example .env

# Edit .env with your production values:
DATABASE_URL=mysql://username:password@localhost/snapbrander_db
SECRET_KEY=your-production-secret-key
CPANEL_HOST=https://your-server.com:2083
CPANEL_USER=your-cpanel-username
CPANEL_TOKEN=your-cpanel-api-token
CPANEL_DOMAIN=your-domain.com
```

### 3. Database Setup
```sql
-- Create main application database
CREATE DATABASE snapbrander_db;
CREATE USER 'snapbrander_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON snapbrander_db.* TO 'snapbrander_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. cPanel API Configuration
1. Log into cPanel
2. Go to "Manage API Tokens"
3. Create a new API token with permissions:
   - Subdomain management
   - Database management
   - File management
   - Softaculous (if available)

### 5. FastAPI Application Setup
```python
# Create passenger_wsgi.py for cPanel Python apps
import sys
import os

# Add your project directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app
application = app
```

## Frontend Deployment

### 1. Build the Frontend
```bash
cd snapbrander-frontend
npm install
npm run build
```

### 2. Upload to cPanel
```bash
# Upload the built files to public_html/
# The .next/static files should be accessible via web
```

### 3. Configure Web Server
```apache
# .htaccess for Next.js on cPanel
RewriteEngine On

# Handle API routes
RewriteRule ^api/(.*)$ /api/passenger_wsgi.py/$1 [QSA,L]

# Handle Next.js routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]
```

## Client Site Creation Workflow

### 1. Automatic Subdomain Creation
When a client site is created, the system will:
```python
# Create subdomain: client-123.yourdomain.com
subdomain = f"client-{project_id}-{sanitized_name}"
cpanel_manager.create_subdomain(subdomain, project_id)
```

### 2. Database Isolation
Each client gets their own database:
```python
# Database naming: yourusername_wp_projectid_random
db_name = f"{cpanel_user}_wp_{project_id}_{random_suffix}"
cpanel_manager.create_database(db_name, project_id)
```

### 3. WordPress Installation
```python
# Automated WordPress setup
wp_config = {
    "domain": f"{subdomain}.{main_domain}",
    "database": db_config,
    "admin_credentials": client_admin_data,
    "theme": selected_template,
    "plugins": ["elementor", "woocommerce", "yoast-seo"]
}
```

## cPanel Integration Details

### Subdomain Management
```python
# API endpoint for subdomain creation
POST /execute/SubDomain/addsubdomain
{
    "domain": "client-name",
    "rootdomain": "yourdomain.com",
    "dir": "public_html/clients/project_id_subdomain"
}
```

### Database Management
```python
# Create database
POST /execute/Mysql/create_database
{"name": "username_wp_projectid"}

# Create user
POST /execute/Mysql/create_user
{"name": "username_wp_user", "password": "secure_password"}

# Grant privileges
POST /execute/Mysql/set_privileges_on_database
{
    "user": "username_wp_user",
    "database": "username_wp_projectid",
    "privileges": "ALL PRIVILEGES"
}
```

### File Management
```python
# Upload WordPress files
POST /execute/Fileman/upload_files
{
    "dir": "/public_html/clients/project_id",
    "file": "wordpress.zip"
}
```

## Security Considerations

### 1. API Token Security
- Store cPanel API tokens securely
- Use environment variables
- Rotate tokens regularly
- Limit token permissions

### 2. Database Security
- Use unique database names per project
- Generate strong random passwords
- Limit database user permissions
- Regular backups

### 3. File Permissions
```bash
# Set proper permissions for WordPress
find /public_html/clients/ -type d -exec chmod 755 {} \;
find /public_html/clients/ -type f -exec chmod 644 {} \;
chmod 600 /public_html/clients/*/wp-config.php
```

## Monitoring and Maintenance

### 1. Health Checks
```python
# Automated health monitoring
@router.get("/health-check/{project_id}")
async def check_site_health(project_id: int):
    # Check site accessibility
    # Verify database connection
    # Monitor resource usage
```

### 2. Backup Strategy
```python
# Automated backups
@router.post("/backup-site/{project_id}")
async def backup_site(project_id: int):
    # Create database backup
    # Archive website files
    # Store in secure location
```

### 3. Updates Management
```python
# WordPress core and plugin updates
@router.post("/update-site/{project_id}")
async def update_site(project_id: int):
    # Update WordPress core
    # Update plugins
    # Update themes
    # Test functionality
```

## Scaling Considerations

### 1. Resource Limits
- Monitor CPU and memory usage
- Implement rate limiting
- Use caching strategies
- Optimize database queries

### 2. Storage Management
- Regular cleanup of temporary files
- Compress backups
- Archive old projects
- Monitor disk usage

### 3. Performance Optimization
- Use CDN for static assets
- Implement Redis caching
- Optimize images automatically
- Minify CSS/JS files

## Troubleshooting

### Common Issues
1. **cPanel API Authentication Fails**
   - Verify API token permissions
   - Check token expiration
   - Confirm cPanel URL format

2. **Database Connection Errors**
   - Verify database credentials
   - Check MySQL service status
   - Confirm user permissions

3. **WordPress Installation Fails**
   - Check file permissions
   - Verify database connectivity
   - Confirm PHP version compatibility

4. **Subdomain Not Accessible**
   - Check DNS propagation
   - Verify subdomain creation
   - Confirm web server configuration

### Log Monitoring
```bash
# Monitor application logs
tail -f /path/to/logs/snapbrander.log

# Monitor cPanel error logs
tail -f /usr/local/cpanel/logs/error_log

# Monitor WordPress logs
tail -f /public_html/clients/*/wp-content/debug.log
```

## Support and Maintenance

### Regular Tasks
- Weekly security updates
- Monthly backup verification
- Quarterly performance reviews
- Annual security audits

### Emergency Procedures
- Site restoration from backup
- Security incident response
- Performance issue resolution
- Data recovery procedures

This deployment guide ensures that SnapBrander can be successfully deployed to a cPanel environment with proper client site isolation and management capabilities.
