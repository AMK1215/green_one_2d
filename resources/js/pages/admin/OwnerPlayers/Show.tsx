import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Phone, Calendar, TrendingUp, Wallet, Target, History } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'All Players',
        href: '/owner/players',
    },
    {
        title: 'Player Details',
        href: '#',
    },
];

interface Player {
    id: number;
    name: string;
    user_name: string;
    phone: string;
    status: number;
    referral_code: string;
    agent_id: number;
    agent_name: string;
    created_at: string;
    total_spin: number;
    total_bet_amount: number;
    total_payout_amount: number;
}

interface Props {
    player: Player;
}

export default function OwnerPlayerShow({ player }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: number) => {
        return status === 1 ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
                Active
            </Badge>
        ) : (
            <Badge variant="destructive">
                Banned
            </Badge>
        );
    };

    const netProfit = player.total_payout_amount - player.total_bet_amount;
    const profitColor = netProfit >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Player Details - ${player.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/owner/players">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Player Details
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Detailed information for {player.name}
                        </p>
                    </div>
                </div>

                {/* Player Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Player Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Name</label>
                                    <p className="text-lg font-semibold">{player.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Username</label>
                                    <p className="text-lg font-semibold">{player.user_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="text-lg font-semibold flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {player.phone || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <div className="mt-1">
                                        {getStatusBadge(player.status)}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Referral Code</label>
                                    <p className="text-lg font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm font-mono">
                                        {player.referral_code}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Agent</label>
                                    <p className="text-lg font-semibold">{player.agent_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                                    <p className="text-lg font-semibold flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(player.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Spins
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{player.total_spin}</div>
                            <p className="text-xs text-muted-foreground">
                                Total betting rounds
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bet Amount
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(player.total_bet_amount)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total amount wagered
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Payouts
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(player.total_payout_amount)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total winnings received
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Net Profit/Loss
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${profitColor}`}>
                                {formatCurrency(Math.abs(netProfit))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {netProfit >= 0 ? 'Player profit' : 'House profit'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>
                            Available actions for this player
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Link href={`/owner/players/${player.id}/transfer-logs`}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    View Transfer Logs
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
