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
    ArrowUpRight,
    Plus,
    Eye
} from 'lucide-react';

interface User {
    id: number;
    user_name: string;
    name: string;
    balanceFloat: number;
}

interface DashboardStats {
    total_players: number;
    active_players_today: number;
    my_balance: number;
    total_players_balance: number;
    total_bets_today: number;
    total_bet_amount_today: number;
    total_transfers_today: number;
}

interface RecentActivity {
    type: string;
    message: string;
    time: string;
    amount?: number;
}

interface PlayerStat {
    id: number;
    user_name: string;
    name: string;
    balance: number;
    total_bets: number;
    total_bet_amount: number;
    status: number;
    last_activity: string;
}

interface Props {
    user: User;
    stats: DashboardStats;
    recentActivities: RecentActivity[];
    playerStats: PlayerStat[];
}

export default function AgentDashboard({ user, stats, recentActivities, playerStats }: Props) {
    const breadcrumbs = [
        { title: 'Agent Dashboard', href: '/agent/dashboard' },
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
            <Head title="Agent Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
                    <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
                    <p className="text-green-100 mb-4">Welcome, {user.name}! Manage your players and track performance.</p>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                            Agent Account
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
                            <CardTitle className="text-sm font-medium">My Players</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
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
                            <CardTitle className="text-sm font-medium">My Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.my_balance)}</div>
                            <p className="text-xs text-muted-foreground">
                                Available for transfers
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Players Balance</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_players_balance)}</div>
                            <p className="text-xs text-muted-foreground">
                                Total player liquidity
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
                        <CardTitle>Agent Actions</CardTitle>
                        <CardDescription>
                            Manage your players and operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button asChild className="h-20 flex-col gap-2">
                                <Link href="/admin/players/create">
                                    <Plus className="h-6 w-6" />
                                    Create Player
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/admin/players">
                                    <Users className="h-6 w-6" />
                                    Manage Players
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/admin/agent/transfers">
                                    <ArrowUpRight className="h-6 w-6" />
                                    View Transfers
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/admin/agent/reports">
                                    <BarChart3 className="h-6 w-6" />
                                    View Reports
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Players */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Top Players (7 Days)
                                </div>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/players">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View All
                                    </Link>
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Players ranked by betting activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {playerStats.map((player, index) => (
                                    <div key={player.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{player.user_name}</p>
                                                <p className="text-xs text-muted-foreground">{player.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(player.total_bet_amount)}</p>
                                            <p className="text-xs text-muted-foreground">{player.total_bets} bets</p>
                                        </div>
                                    </div>
                                ))}
                                {playerStats.length === 0 && (
                                    <p className="text-center text-muted-foreground py-4">
                                        No betting activity in the last 7 days
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Recent Activities
                            </CardTitle>
                            <CardDescription>
                                Latest activities from your players
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
                </div>
            </div>
        </AppLayout>
    );
}
