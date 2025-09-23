# 🛡️ Middleware Guide for 2D Betting Game

This guide covers all the middleware created for your 4-role permission system (Owner, Agent, Player, SystemWallet).

## 📋 Available Middleware

### 1. **CheckPermission** (`check.permission`)
**Purpose**: Check if user has specific permission(s)
**Usage**: `middleware(['check.permission:permission_name'])`

```php
// Single permission
Route::get('/admin/agents', [AgentController::class, 'index'])
    ->middleware(['check.permission:agent_index']);

// Multiple permissions (OR logic)
Route::get('/admin/reports', [ReportController::class, 'index'])
    ->middleware(['check.permission:view_reports|view_analytics']);
```

### 2. **CheckRole** (`check.role`)
**Purpose**: Check if user has specific role(s)
**Usage**: `middleware(['check.role:Role1|Role2'])`

```php
// Single role
Route::get('/admin/settings', [SettingsController::class, 'index'])
    ->middleware(['check.role:Owner']);

// Multiple roles (OR logic)
Route::get('/admin/players', [PlayerController::class, 'index'])
    ->middleware(['check.role:Owner|Agent']);
```

### 3. **OwnerOnly** (`owner.only`)
**Purpose**: Owner-only access
**Usage**: `middleware(['owner.only'])`

```php
Route::get('/admin/system-settings', [SystemController::class, 'index'])
    ->middleware(['owner.only']);
```

### 4. **AgentOrOwner** (`agent.or.owner`)
**Purpose**: Agent or Owner access only
**Usage**: `middleware(['agent.or.owner'])`

```php
Route::resource('players', PlayerController::class)
    ->middleware(['agent.or.owner']);
```

### 5. **CheckBanned** (`check.banned`)
**Purpose**: Check if user is banned (status = 0)
**Usage**: `middleware(['check.banned'])`

```php
Route::middleware(['auth', 'check.banned'])->group(function () {
    // Protected routes
});
```

### 6. **CheckUserStatus** (`check.status`)
**Purpose**: Check user status and password change requirement
**Usage**: `middleware(['check.status'])`

```php
Route::middleware(['auth', 'check.status'])->group(function () {
    // Routes that require active status
});
```

### 7. **BettingAccess** (`betting.access`)
**Purpose**: Control access to betting features
**Usage**: `middleware(['betting.access'])`

```php
Route::prefix('betting')->middleware(['betting.access'])->group(function () {
    Route::get('/2d', [BettingController::class, 'show']);
    Route::post('/2d/place', [BettingController::class, 'place']); // Players only
});
```

### 8. **TransactionMiddleware** (`transaction.key`)
**Purpose**: Validate transaction API key
**Usage**: `middleware(['transaction.key'])`

```php
Route::prefix('api')->middleware(['transaction.key'])->group(function () {
    Route::post('/betting/callback', [ApiController::class, 'bettingCallback']);
});
```

### 9. **AuthGates** (`auth.gates`)
**Purpose**: Set up Laravel Gates for permissions
**Usage**: `middleware(['auth.gates'])`

```php
Route::middleware(['auth', 'auth.gates'])->group(function () {
    // Routes that use Gate::allows() checks
});
```

## 🎯 Common Middleware Combinations

### **Admin Panel Access**
```php
Route::prefix('admin')->middleware(['auth', 'check.status', 'auth.gates'])->group(function () {
    // Admin routes
});
```

### **Owner Dashboard**
```php
Route::middleware(['auth', 'check.status', 'owner.only'])->group(function () {
    // Owner-only routes
});
```

### **Agent Management**
```php
Route::middleware(['auth', 'check.status', 'agent.or.owner'])->group(function () {
    // Agent and Owner routes
});
```

### **Player Betting**
```php
Route::middleware(['auth', 'check.status', 'betting.access'])->group(function () {
    // Betting routes
});
```

### **API Endpoints**
```php
Route::middleware(['transaction.key'])->group(function () {
    // Protected API routes
});
```

## 🔧 Middleware Registration

All middleware are registered in `bootstrap/app.php`:

```php
$middleware->alias([
    'check.permission' => \App\Http\Middleware\CheckPermission::class,
    'check.role' => \App\Http\Middleware\CheckRole::class,
    'owner.only' => \App\Http\Middleware\OwnerOnly::class,
    'agent.or.owner' => \App\Http\Middleware\AgentOrOwner::class,
    'check.banned' => \App\Http\Middleware\CheckBanned::class,
    'check.status' => \App\Http\Middleware\CheckUserStatus::class,
    'betting.access' => \App\Http\Middleware\BettingAccess::class,
    'transaction.key' => \App\Http\Middleware\TransactionMiddleware::class,
    'auth.gates' => \App\Http\Middleware\AuthGates::class,
]);
```

## 🎮 Role-Based Route Protection

### **Owner Routes**
```php
// Full system access
Route::middleware(['owner.only'])->group(function () {
    Route::get('/admin/system-settings', [SystemController::class, 'index']);
    Route::resource('/admin/agents', AgentController::class);
    Route::get('/admin/reports/master', [ReportController::class, 'master']);
});
```

### **Agent Routes**
```php
// Agent-specific access
Route::middleware(['check.role:Agent'])->group(function () {
    Route::resource('/admin/players', PlayerController::class);
    Route::get('/admin/reports/players', [ReportController::class, 'players']);
});

// Agent or Owner access
Route::middleware(['agent.or.owner'])->group(function () {
    Route::get('/admin/transfers', [TransferController::class, 'index']);
});
```

### **Player Routes**
```php
// Player-only betting
Route::middleware(['check.role:Player', 'betting.access'])->group(function () {
    Route::post('/betting/2d/place', [BettingController::class, 'place']);
});

// Player account management
Route::middleware(['check.role:Player'])->group(function () {
    Route::get('/account/history', [AccountController::class, 'history']);
});
```

### **SystemWallet Routes**
```php
// System operations
Route::middleware(['check.role:SystemWallet'])->group(function () {
    Route::post('/system/process-settlements', [SystemController::class, 'settlements']);
});
```

## 🔒 Permission-Based Protection

### **Specific Permissions**
```php
// Agent management
Route::middleware(['check.permission:agent_create'])->group(function () {
    Route::post('/admin/agents', [AgentController::class, 'store']);
});

// Player management
Route::middleware(['check.permission:player_create'])->group(function () {
    Route::post('/admin/players', [PlayerController::class, 'store']);
});

// Betting management
Route::middleware(['check.permission:manage_betting_limits'])->group(function () {
    Route::post('/admin/betting/limits', [BettingController::class, 'updateLimits']);
});

// Financial operations
Route::middleware(['check.permission:make_transfer'])->group(function () {
    Route::post('/admin/transfer', [TransferController::class, 'make']);
});
```

## 🚨 Error Handling

### **Common HTTP Status Codes**
- **401**: Authentication required
- **403**: Permission denied / Access forbidden
- **422**: Validation error

### **Custom Error Messages**
```php
// In middleware
abort(403, 'Access denied. You do not have the required role to access this resource.');
abort(401, 'Authentication required.');
```

## 🧪 Testing Middleware

### **Test Authentication**
```php
// Test if routes are protected
$response = $this->get('/admin/dashboard');
$response->assertRedirect('/login');
```

### **Test Role Access**
```php
// Test owner access
$owner = User::factory()->create();
$owner->assignRole('Owner');
$response = $this->actingAs($owner)->get('/admin/system-settings');
$response->assertStatus(200);

// Test unauthorized access
$player = User::factory()->create();
$player->assignRole('Player');
$response = $this->actingAs($player)->get('/admin/system-settings');
$response->assertStatus(403);
```

## 🎯 Best Practices

1. **Layer Security**: Use multiple middleware for sensitive routes
2. **Specific Permissions**: Use permission-based middleware for granular control
3. **Role Groups**: Use role-based middleware for broader access control
4. **Status Checks**: Always include status checks for user routes
5. **API Protection**: Use transaction key middleware for API endpoints
6. **Error Messages**: Provide clear, user-friendly error messages

## 📝 Example Complete Route Structure

```php
// routes/admin.php
Route::prefix('admin')->group(function () {
    
    // Public admin routes
    Route::get('/login', [LoginController::class, 'show']);
    
    // Protected admin routes
    Route::middleware(['auth', 'check.status', 'auth.gates'])->group(function () {
        
        // Owner only
        Route::middleware(['owner.only'])->group(function () {
            Route::resource('agents', AgentController::class);
        });
        
        // Agent or Owner
        Route::middleware(['agent.or.owner'])->group(function () {
            Route::resource('players', PlayerController::class);
        });
        
        // Permission-based
        Route::middleware(['check.permission:view_reports'])->group(function () {
            Route::get('/reports', [ReportController::class, 'index']);
        });
    });
});

// Betting routes
Route::prefix('betting')->middleware(['auth', 'check.status', 'betting.access'])->group(function () {
    Route::get('/2d', [BettingController::class, 'show']);
    Route::post('/2d/place', [BettingController::class, 'place']);
});

// API routes
Route::prefix('api')->middleware(['transaction.key'])->group(function () {
    Route::post('/callback', [ApiController::class, 'callback']);
});
```

Your middleware system is now complete and ready to secure your 2D betting game! 🎉
