# 🎯 2D Betting Game - Permission System Seeding Guide

This guide will help you properly seed your Laravel 12 2D betting game with the complete role-based permission system.

## 📋 Overview

Your permission system includes:
- **4 User Roles**: Owner, Agent, Player, SystemWallet
- **40+ Permissions**: Comprehensive coverage of all system features
- **Hierarchical Structure**: Owner → Agent → Player
- **Wallet Integration**: Using Bavix Laravel Wallet package

## 🚀 Quick Start

### Option 1: Using the Automated Script (Recommended)

**For Windows:**
```bash
# Run the batch file
.\seed-permissions.bat
```

**For Linux/Mac:**
```bash
# Make executable and run
chmod +x seed-permissions.sh
./seed-permissions.sh
```

### Option 2: Manual Seeding

```bash
# 1. Clear cache
php artisan cache:clear
php artisan config:clear

# 2. Run seeders in order
php artisan db:seed --class=RolesTableSeeder
php artisan db:seed --class=PermissionsTableSeeder
php artisan db:seed --class=PermissionRoleTableSeeder
php artisan db:seed --class=UsersTableSeeder
php artisan db:seed --class=RoleUserTableSeeder
```

### Option 3: All at Once
```bash
php artisan db:seed
```

## 📊 What Gets Seeded

### 1. Roles (4 roles)
| Role | ID | Description |
|------|----|----|
| Owner | 1 | System owner with full access |
| Agent | 2 | Agent managing players |
| Player | 3 | End users who place bets |
| SystemWallet | 4 | System financial account |

### 2. Permissions (40+ permissions)
Organized by groups:
- **Owner**: Full system control, reports, game management, agent management
- **Agent**: Player management, transfers, reports
- **Player**: Betting, viewing history
- **SystemWallet**: Financial operations

### 3. Test Users (if enabled)
| Username | Role | Password | Initial Balance |
|----------|------|----------|----------------|
| GreenOne | Owner | gscplus | 500,000,000 |
| AGENTPW001 | Agent | gscplus | 100,000-200,000 |
| AGENTPW002 | Agent | gscplus | 100,000-200,000 |
| SKP0101 | Player | gscplus | 10,000 |
| PWPLAYER* | Players | gscplus | 10,000 each |
| SYS001 | SystemWallet | gscplus | 5,000,000 |

## 🔧 Configuration

### Before Seeding
1. **Database**: Ensure your database is set up and migrated
```bash
php artisan migrate
```

2. **Environment**: Check your `.env` file for database settings
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=green_one_2d
DB_USERNAME=root
DB_PASSWORD=
```

3. **Wallet Package**: Ensure Bavix Wallet is published
```bash
php artisan vendor:publish --provider="Bavix\Wallet\WalletServiceProvider"
php artisan migrate
```

### After Seeding
1. **Cache**: Clear all caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

2. **Verification**: Check if seeding was successful
```bash
php artisan tinker
>>> App\Models\Admin\Role::count()
>>> App\Models\Admin\Permission::count()
>>> App\Models\User::count()
```

## 🎮 Testing the System

### 1. Login Test
Try logging in with different user types:
```
URL: /login
- Owner: GreenOne / gscplus
- Agent: AGENTPW001 / gscplus  
- Player: SKP0101 / gscplus
```

### 2. Permission Test
```php
// In tinker or controller
$user = User::where('user_name', 'AGENTPW001')->first();
$user->hasRole('Agent'); // should return true
$user->hasPermission('player_create'); // should return true
```

### 3. Wallet Test
```php
$user = User::where('user_name', 'SKP0101')->first();
$user->balanceFloat; // should return 10000.00
```

## 🔍 Troubleshooting

### Common Issues

**1. "Class not found" errors**
```bash
composer dump-autoload
php artisan clear-compiled
```

**2. "Permission not found" errors**
- Check if PermissionsTableSeeder ran successfully
- Verify all permissions exist in database

**3. "Role assignment failed" errors**
- Ensure RolesTableSeeder ran before RoleUserTableSeeder
- Check user types match enum values

**4. Wallet errors**
```bash
php artisan vendor:publish --provider="Bavix\Wallet\WalletServiceProvider"
php artisan migrate
```

### Reset and Re-seed
```bash
# Reset database (CAUTION: This deletes all data)
php artisan migrate:fresh

# Then run seeders again
php artisan db:seed
```

## 🔐 Security Notes

1. **Change Default Passwords**: Update all default passwords in production
2. **Environment**: Use strong database credentials
3. **Permissions**: Review and adjust permissions based on your needs
4. **Wallet Security**: Monitor financial transactions closely

## 📝 Customization

### Adding New Permissions
1. Add to `PermissionsTableSeeder.php`
2. Update `PermissionRoleTableSeeder.php` role assignments
3. Re-run the seeders

### Adding New Roles
1. Add to `RolesTableSeeder.php`
2. Update `UserType.php` enum
3. Add permissions in `PermissionRoleTableSeeder.php`
4. Re-run the seeders

### Modifying User Hierarchy
1. Update `UserType.php` methods
2. Adjust `canHaveChild()` logic
3. Update controller logic if needed

## 🎯 Next Steps

After successful seeding:
1. **Create Admin Routes**: Set up protected admin routes
2. **Build Frontend**: Develop React components for different user roles
3. **Add Middleware**: Implement route protection
4. **Test Betting**: Test 2D betting functionality
5. **Add Monitoring**: Implement logging and monitoring

## 📞 Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Enable debug mode: `APP_DEBUG=true` in `.env`
3. Check database connections
4. Verify all migrations are run

---

🎉 **Your 2D betting game permission system is now ready for action!**
