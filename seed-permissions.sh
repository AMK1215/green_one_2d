#!/bin/bash

echo "🚀 Starting Permission System Seeding Process..."
echo "================================================"

# Check if we're in a Laravel project
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from your Laravel project root."
    exit 1
fi

# Backup database (optional - uncomment if needed)
# echo "📦 Creating database backup..."
# php artisan db:backup

echo "🔧 Clearing application cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "📊 Running individual seeders in correct order..."

echo "1️⃣ Seeding Roles..."
php artisan db:seed --class=RolesTableSeeder
if [ $? -eq 0 ]; then
    echo "✅ Roles seeded successfully"
else
    echo "❌ Failed to seed roles"
    exit 1
fi

echo "2️⃣ Seeding Permissions..."
php artisan db:seed --class=PermissionsTableSeeder
if [ $? -eq 0 ]; then
    echo "✅ Permissions seeded successfully"
else
    echo "❌ Failed to seed permissions"
    exit 1
fi

echo "3️⃣ Seeding Permission-Role relationships..."
php artisan db:seed --class=PermissionRoleTableSeeder
if [ $? -eq 0 ]; then
    echo "✅ Permission-Role relationships seeded successfully"
else
    echo "❌ Failed to seed permission-role relationships"
    exit 1
fi

echo "4️⃣ Seeding Users (if needed)..."
read -p "Do you want to seed users? This will create test users with wallets (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    php artisan db:seed --class=UsersTableSeeder
    if [ $? -eq 0 ]; then
        echo "✅ Users seeded successfully"
    else
        echo "❌ Failed to seed users"
        exit 1
    fi
    
    echo "5️⃣ Seeding User-Role relationships..."
    php artisan db:seed --class=RoleUserTableSeeder
    if [ $? -eq 0 ]; then
        echo "✅ User-Role relationships seeded successfully"
    else
        echo "❌ Failed to seed user-role relationships"
        exit 1
    fi
else
    echo "⏭️ Skipping user seeding"
fi

echo "🧹 Clearing cache again..."
php artisan cache:clear

echo ""
echo "🎉 Permission system seeding completed successfully!"
echo "================================================"
echo ""
echo "📋 Summary of what was seeded:"
echo "  • 4 Roles: Owner, Agent, Player, SystemWallet"
echo "  • 40+ Permissions: Covering all aspects of your betting system"
echo "  • Permission-Role assignments: Based on your hierarchy"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  • Test users with proper roles and wallet balances"
fi
echo ""
echo "🔐 Default login credentials (if users were seeded):"
echo "  • Owner: GreenOne / gscplus"
echo "  • Agent: AGENTPW001 / gscplus"
echo "  • Player: SKP0101 / gscplus"
echo ""
echo "✨ Your 2D betting game permission system is now ready!"
