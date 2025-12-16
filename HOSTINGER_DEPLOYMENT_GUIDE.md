# ==============================================
# HOSTINGER DEPLOYMENT GUIDE - POS SYSTEM
# ==============================================

## REQUIREMENTS   
- Hostinger Business or Premium Hosting (for PHP 8.2+ support)
- MySQL Database
- SSL Certificate (free with Hostinger)

## STEP 1: CREATE DATABASE ON HOSTINGER
1. Login to Hostinger hPanel
2. Go to "Databases" > "MySQL Databases"
3. Create a new database (e.g., "pos_db")
4. Note down: Database Name, Username, Password, Host (usually localhost)

## STEP 2: UPLOAD BACKEND (Laravel)

### Option A: Using File Manager
1. Go to hPanel > "File Manager"
2. Navigate to public_html folder
3. Create a folder called "api" (for backend)
4. Upload the entire "backend/backend" folder contents to "api" folder
5. The structure should be:
   ```
   public_html/
   └── api/
       ├── app/
       ├── bootstrap/
       ├── config/
       ├── database/
       ├── public/
       ├── resources/
       ├── routes/
       ├── storage/
       ├── vendor/
       ├── .env
       ├── artisan
       └── composer.json
   ```

### Option B: Using FTP (Recommended for large files)
1. Get FTP credentials from hPanel > "FTP Accounts"
2. Use FileZilla or similar FTP client
3. Upload backend files to public_html/api/

## STEP 3: CONFIGURE BACKEND .ENV FILE
1. In File Manager, navigate to public_html/api/
2. Edit .env file with these settings:

```
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:GENERATE_NEW_KEY
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_secure_jwt_secret
REFRESH_SECRET=your_secure_refresh_secret
```

## STEP 4: SET UP LARAVEL PUBLIC FOLDER
Hostinger needs the public folder to be the entry point.

### Method 1: Create .htaccess in api folder
Create/edit .htaccess in public_html/api/:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### Method 2: Point subdomain to public folder
1. Create subdomain: api.yourdomain.com
2. Point it to: public_html/api/public

## STEP 5: SET FOLDER PERMISSIONS
Via SSH or File Manager, set permissions:
- storage/ folder: 775
- bootstrap/cache/ folder: 775

## STEP 6: RUN MIGRATIONS
If you have SSH access:
```bash
cd ~/public_html/api
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
```

If no SSH, you can create a temporary PHP file to run migrations:
Create "migrate.php" in public_html/api/public/:
```php
<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('migrate', ['--force' => true]);
$kernel->call('db:seed', ['--force' => true]);
echo "Migrations completed!";
// DELETE THIS FILE AFTER RUNNING!
```

## STEP 7: UPLOAD FRONTEND (React)

1. First, update the .env.production file with your API URL:
   ```
   VITE_APP_API=https://api.yourdomain.com
   ```

2. Rebuild the frontend:
   ```
   npm run build
   ```

3. Upload the contents of "frontend/dist/" folder to:
   - public_html/ (for main domain)
   - OR create a subdomain for frontend

4. Create/edit .htaccess in the frontend folder:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## STEP 8: CONFIGURE CORS (if needed)
Edit config/cors.php in backend:
```php
'allowed_origins' => ['https://yourdomain.com'],
```

## STEP 9: SSL CERTIFICATE
1. Go to hPanel > "SSL"
2. Enable Free SSL for your domain
3. Force HTTPS redirect

## FOLDER STRUCTURE ON HOSTINGER
```
public_html/
├── api/                    # Laravel Backend
│   ├── app/
│   ├── public/
│   │   └── index.php      # API entry point
│   ├── .env
│   └── ...
├── index.html              # React Frontend
├── assets/                 # React built assets
└── .htaccess               # Frontend routing
```

## TROUBLESHOOTING

### 500 Internal Server Error
- Check .env file configuration
- Check folder permissions (storage: 775)
- Check PHP version (needs 8.2+)

### CORS Errors
- Update config/cors.php with your frontend domain
- Clear config cache: php artisan config:clear

### Database Connection Error
- Verify database credentials in .env
- Check if database exists
- Verify MySQL host (usually "localhost" on Hostinger)

### API Not Found
- Check .htaccess configuration
- Verify subdomain pointing to correct folder

## RECOMMENDED DOMAIN SETUP
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com

## SECURITY CHECKLIST
- [ ] APP_DEBUG=false in production
- [ ] Strong JWT_SECRET and REFRESH_SECRET
- [ ] SSL enabled
- [ ] Delete migrate.php after running
- [ ] Set proper file permissions
