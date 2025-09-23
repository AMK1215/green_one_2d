import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Eye, 
    TrendingUp,
    Wallet,
    UserCheck,
    History,
    User
} from 'lucide-react';
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
    players: Player[];
    canCreate: boolean;
}

export default function OwnerPlayersIndex({ players, canCreate }: Props) {
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Players - Owner View" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            All Players
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            View all players across the entire system (Read-only)
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Players
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{players.length}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Players
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {players.filter(player => player.status === 1).length}
                            </div>
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
                                {formatCurrency(players.reduce((total, player) => total + player.total_bet_amount, 0))}
                            </div>
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
                                {formatCurrency(players.reduce((total, player) => total + player.total_payout_amount, 0))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Players Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Players</CardTitle>
                        <CardDescription>
                            Complete list of all players in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Player</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Username</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Phone</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Agent</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Status</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Total Spins</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Bet Amount</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Payouts</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((player) => (
                                        <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">
                                                {player.name}
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{player.user_name}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{player.phone || 'N/A'}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-blue-500" />
                                                    <span>{player.agent_name}</span>
                                                </div>
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{getStatusBadge(player.status)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{player.total_spin}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{formatCurrency(player.total_bet_amount)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{formatCurrency(player.total_payout_amount)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/owner/players/${player.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/owner/players/${player.id}/transfer-logs`}>
                                                        <Button variant="outline" size="sm">
                                                            <History className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {players.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No players found in the system.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
