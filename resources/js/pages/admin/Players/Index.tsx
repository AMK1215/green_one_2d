import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    Users, 
    Eye, 
    Edit, 
    DollarSign, 
    Shield,
    TrendingUp,
    Wallet,
    UserCheck,
    History
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Players',
        href: '/admin/players',
    },
];

interface Player {
    id: number;
    name: string;
    user_name: string;
    phone: string;
    status: number;
    roles: string[];
    total_spin: number;
    total_bet_amount: number;
    total_payout_amount: number;
    logs: any[];
}

interface Props {
    users: Player[];
    canCreate?: boolean;
}

export default function PlayersIndex({ users, canCreate = false }: Props) {
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

    const handleBanPlayer = (playerId: number) => {
        if (confirm('Are you sure you want to ban this player?')) {
            router.post(`/admin/players/${playerId}/ban`);
        }
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
            <Head title="Players Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Players Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage and monitor your players
                        </p>
                    </div>
                    {canCreate && (
                        <Link href="/admin/players/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Player
                            </Button>
                        </Link>
                    )}
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
                            <div className="text-2xl font-bold">{users.length}</div>
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
                                {users.filter(player => player.status === 1).length}
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
                                {formatCurrency(users.reduce((total, player) => total + player.total_bet_amount, 0))}
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
                                {formatCurrency(users.reduce((total, player) => total + player.total_payout_amount, 0))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Players Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Players List</CardTitle>
                        <CardDescription>
                            Manage and monitor your players
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
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Status</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Total Spins</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Bet Amount</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Payouts</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((player) => (
                                        <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">
                                                {player.name}
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{player.user_name}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{player.phone || 'N/A'}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{getStatusBadge(player.status)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{player.total_spin}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{formatCurrency(player.total_bet_amount)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{formatCurrency(player.total_payout_amount)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/players/${player.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/players/${player.id}/cash-in`}>
                                                        <Button variant="outline" size="sm">
                                                            <DollarSign className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                <Link href={`/admin/players/${player.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/players/${player.id}/transfer-logs`}>
                                                    <Button variant="outline" size="sm">
                                                        <History className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {player.status === 1 && (
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleBanPlayer(player.id)}
                                                    >
                                                        Ban
                                                    </Button>
                                                )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
