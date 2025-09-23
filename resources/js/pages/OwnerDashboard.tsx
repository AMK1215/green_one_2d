import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    UserCheck, 
    Wallet, 
    TrendingUp, 
    Activity,
    DollarSign,
    BarChart3,
    Settings,
    Dice1,
    Plus
} from 'lucide-react';

interface User {
    id: number;
    user_name: string;
    name: string;
    balanceFloat: number;
}

interface DashboardStats {
    total_agents: number;
    total_players: number;
    active_players_today: number;
    my_balance: number;
    total_balance: number;
    total_bets_today: number;
    total_bet_amount_today: number;
    total_transfers_today: number;
    total_transfer_amount_today: number;
}

interface RecentActivity {
    type: string;
    message: string;
    time: string;
    user?: string;
    amount?: number;
}

interface BettingStats {
    daily_bets: Array<{
        date: string;
        count: number;
        amount: number;
    }>;
    popular_numbers: Array<{
        bet_number: string;
        count: number;
    }>;
}

interface Props {
    user: User;
    stats: DashboardStats;
    recentActivities: RecentActivity[];
    bettingStats: BettingStats;
}

export default function OwnerDashboard({ user, stats, recentActivities, bettingStats }: Props) {
    const breadcrumbs = [
        { title: 'Owner Dashboard', href: '/owner/dashboard' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'MMK',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owner Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                    <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
                    <p className="text-blue-100 mb-4">Welcome back, {user.name}! Here's your system overview.</p>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                            System Owner
                        </Badge>
                        <div className="text-sm">
                            Balance: <span className="font-bold">{formatCurrency(stats.my_balance)}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_agents}</div>
                            <p className="text-xs text-muted-foreground">
                                Active agents in system
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_players}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_players_today} active today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_balance)}</div>
                            <p className="text-xs text-muted-foreground">
                                Total system liquidity
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Bets</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bets_today}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(stats.total_bet_amount_today)} volume
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Owner Actions</CardTitle>
                        <CardDescription>
                            Manage your 2D betting system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button asChild className="h-20 flex-col gap-2">
                                <Link href="/admin/agents/create">
                                    <Plus className="h-6 w-6" />
                                    Create Agent
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/admin/agents">
                                    <Users className="h-6 w-6" />
                                    Manage Agents
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/admin/owner/reports">
                                    <BarChart3 className="h-6 w-6" />
                                    System Reports
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/admin/system-settings">
                                    <Settings className="h-6 w-6" />
                                    System Settings
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                System Activities
                            </CardTitle>
                            <CardDescription>
                                Latest activities across the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                                        <div className="flex-1">
                                            <p className="text-sm">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(activity.time)}
                                            </p>
                                        </div>
                                        {activity.amount && (
                                            <Badge variant={activity.type === 'transfer' ? 'default' : 'secondary'}>
                                                {formatCurrency(activity.amount)}
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                                {recentActivities.length === 0 && (
                                    <p className="text-center text-muted-foreground py-4">
                                        No recent activities
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                System Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Transfers Today</span>
                                <span className="font-medium">{stats.total_transfers_today}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Transfer Volume</span>
                                <span className="font-medium">{formatCurrency(stats.total_transfer_amount_today)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Betting Volume</span>
                                <span className="font-medium">{formatCurrency(stats.total_bet_amount_today)}</span>
                            </div>

                            <div className="pt-4">
                                <Button asChild className="w-full" variant="outline">
                                    <Link href="/admin/2d/dashboard">
                                        <Dice1 className="h-4 w-4 mr-2" />
                                        2D Game Management
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Popular Numbers */}
                {bettingStats.popular_numbers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Dice1 className="h-5 w-5" />
                                Popular Numbers (Last 7 Days)
                            </CardTitle>
                            <CardDescription>
                                Most frequently bet 2-digit numbers across the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                                {bettingStats.popular_numbers.map((number, index) => (
                                    <div key={index} className="text-center p-3 bg-muted rounded-lg">
                                        <div className="text-xl font-bold text-primary">{number.bet_number}</div>
                                        <div className="text-xs text-muted-foreground">{number.count} bets</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
