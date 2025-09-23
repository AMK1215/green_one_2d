import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    status?: string;
    canResetPassword?: boolean;
    errors?: {
        user_name?: string;
        password?: string;
        email?: string;
    };
}

export default function AdminLogin({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        user_name: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    // Keyboard shortcuts for demo credentials
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        setData('user_name', 'GreenOne');
                        setData('password', 'gscplus');
                        break;
                    case '2':
                        e.preventDefault();
                        setData('user_name', 'AGENTPW001');
                        setData('password', 'gscplus');
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setData]);

    return (
        <>
            <Head title="Admin Login" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo/Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">2D Betting Game</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Admin Portal</p>
                    </div>

                    {/* Status Messages */}
                    {status && (
                        <Alert>
                            <AlertDescription>{status}</AlertDescription>
                        </Alert>
                    )}
                    
                    {/* Flash Error Messages */}
                    {flash?.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {/* Flash Success Messages */}
                    {flash?.success && (
                        <Alert className="border-green-200 bg-green-50 text-green-800">
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access the admin panel
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="user_name">Username</Label>
                                    <Input
                                        id="user_name"
                                        type="text"
                                        value={data.user_name}
                                        onChange={(e) => setData('user_name', e.target.value)}
                                        placeholder="Enter your username (e.g., GreenOne, AGENTPW001)"
                                        className={errors.user_name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                                        autoComplete="username"
                                        autoFocus
                                        required
                                    />
                                    {errors.user_name && (
                                        <p className="text-sm text-red-600">{errors.user_name}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Use your system username (not email address)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className={errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200 pr-10' : 'pr-10'}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-900"
                                            tabIndex={-1}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                                </div>

                                {/* Error Messages */}
                                {(errors.user_name || errors.password) && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {errors.user_name || errors.password || 'Login failed. Please check your credentials.'}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>

                                {canResetPassword && (
                                    <div className="text-center">
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-blue-600 hover:text-blue-500 underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Demo Credentials */}
                    <Card className="bg-gray-50 dark:bg-gray-800 border-dashed">
                        <CardHeader>
                            <CardTitle className="text-lg">Demo Credentials</CardTitle>
                            <CardDescription>
                                Click on any credential to auto-fill the form
                                <br />
                                <span className="text-xs">Keyboard shortcuts: Alt+1 (Owner), Alt+2 (Agent)</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('user_name', 'GreenOne');
                                        setData('password', 'gscplus');
                                    }}
                                    className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors"
                                >
                                    <p className="font-medium text-blue-600">👑 Owner</p>
                                    <p className="text-sm">Username: GreenOne</p>
                                    <p className="text-sm">Password: gscplus</p>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('user_name', 'AGENTPW001');
                                        setData('password', 'gscplus');
                                    }}
                                    className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors"
                                >
                                    <p className="font-medium text-green-600">🏢 Agent</p>
                                    <p className="text-sm">Username: AGENTPW001</p>
                                    <p className="text-sm">Password: gscplus</p>
                                </button>
                            </div>
                            
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        <p>&copy; 2025 2D Betting Game. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
