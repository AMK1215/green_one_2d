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
    History
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Agents',
        href: '/admin/agents',
    },
];

interface Agent {
    id: number;
    name: string;
    user_name: string;
    phone: string;
    status: number;
    referral_code: string;
    balance_float: number;
    roles: Array<{ title: string }>;
    children?: Array<{ two_bets: any[] }>;
}

interface Props {
    users: {
        data: Agent[];
        links: any[];
        meta: any;
    };
    canCreate: boolean;
}

export default function AgentsIndex({ users, canCreate }: Props) {
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

    const getPlayerCount = (agent: Agent) => {
        return agent.children?.length || 0;
    };

    const getBetCount = (agent: Agent) => {
        return agent.children?.reduce((total, child) => 
            total + (child.two_bets?.length || 0), 0) || 0;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const handleBanAgent = (agentId: number) => {
        if (confirm('Are you sure you want to ban this agent?')) {
            router.post(`/admin/agents/${agentId}/ban`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agents Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Agents Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage your agents and their players
                        </p>
                    </div>
                    {canCreate && (
                        <Link href="/admin/agents/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Agent
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Agents
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.meta?.total || 0}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Agents
                            </CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data?.filter(agent => agent.status === 1).length || 0}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Players
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data?.reduce((total, agent) => total + getPlayerCount(agent), 0) || 0}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bets
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data?.reduce((total, agent) => total + getBetCount(agent), 0) || 0}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Balance
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(users.data?.reduce((total, agent) => total + agent.balance_float, 0) || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Agents Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agents List</CardTitle>
                        <CardDescription>
                            Manage and monitor your agents
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Agent</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Username</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Phone</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Status</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Balance</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Players</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Bets</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Referral Code</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data?.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">
                                                {agent.name}
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{agent.user_name}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{agent.phone || 'N/A'}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{getStatusBadge(agent.status)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <span className="font-medium text-green-600">
                                                    {formatCurrency(agent.balance_float)}
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{getPlayerCount(agent)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{getBetCount(agent)}</td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <code className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm font-mono">
                                                    {agent.referral_code}
                                                </code>
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/agents/${agent.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/agents/${agent.id}/cash-in`}>
                                                        <Button variant="outline" size="sm">
                                                            <DollarSign className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/agents/${agent.id}/cash-out`}>
                                                        <Button variant="outline" size="sm">
                                                            <Wallet className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/agents/${agent.id}/transfer-logs`}>
                                                        <Button variant="outline" size="sm">
                                                            <History className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {agent.status === 1 && (
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm"
                                                            onClick={() => handleBanAgent(agent.id)}
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
