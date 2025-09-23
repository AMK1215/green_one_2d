@echo off
echo 🚀 Starting Permission System Seeding Process...
echo ================================================

REM Check if we're in a Laravel project
if not exist "artisan" (
    echo ❌ Error: artisan file not found. Please run this script from your Laravel project root.
    pause
    exit /b 1
)

echo 🔧 Clearing application cache...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo 📊 Running individual seeders in correct order...

echo 1️⃣ Seeding Roles...
php artisan db:seed --class=RolesTableSeeder
if %errorlevel% neq 0 (
    echo ❌ Failed to seed roles
    pause
    exit /b 1
)
echo ✅ Roles seeded successfully

echo 2️⃣ Seeding Permissions...
php artisan db:seed --class=PermissionsTableSeeder
if %errorlevel% neq 0 (
    echo ❌ Failed to seed permissions
    pause
    exit /b 1
)
echo ✅ Permissions seeded successfully

echo 3️⃣ Seeding Permission-Role relationships...
php artisan db:seed --class=PermissionRoleTableSeeder
if %errorlevel% neq 0 (
    echo ❌ Failed to seed permission-role relationships
    pause
    exit /b 1
)
echo ✅ Permission-Role relationships seeded successfully

set /p seed_users="4️⃣ Do you want to seed users? This will create test users with wallets (y/n): "
if /i "%seed_users%"=="y" (
    echo Seeding Users...
    php artisan db:seed --class=UsersTableSeeder
    if %errorlevel% neq 0 (
        echo ❌ Failed to seed users
        pause
        exit /b 1
    )
    echo ✅ Users seeded successfully
    
    echo 5️⃣ Seeding User-Role relationships...
    php artisan db:seed --class=RoleUserTableSeeder
    if %errorlevel% neq 0 (
        echo ❌ Failed to seed user-role relationships
        pause
        exit /b 1
    )
    echo ✅ User-Role relationships seeded successfully
) else (
    echo ⏭️ Skipping user seeding
)

echo 🧹 Clearing cache again...
php artisan cache:clear

echo.
echo 🎉 Permission system seeding completed successfully!
echo ================================================
echo.
echo 📋 Summary of what was seeded:
echo   • 4 Roles: Owner, Agent, Player, SystemWallet
echo   • 40+ Permissions: Covering all aspects of your betting system
echo   • Permission-Role assignments: Based on your hierarchy
if /i "%seed_users%"=="y" (
    echo   • Test users with proper roles and wallet balances
)
echo.
echo 🔐 Default login credentials (if users were seeded):
echo   • Owner: GreenOne / gscplus
echo   • Agent: AGENTPW001 / gscplus
echo   • Player: SKP0101 / gscplus
echo.
echo ✨ Your 2D betting game permission system is now ready!
echo.
pause
