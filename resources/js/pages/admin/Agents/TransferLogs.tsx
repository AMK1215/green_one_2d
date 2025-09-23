import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, History, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';
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
    {
        title: 'Transfer Logs',
        href: '#',
    },
];

interface TransferLog {
    id: number;
    amount: number;
    type: string;
    description: string;
    meta: any;
    created_at: string;
    from_user_id: number;
    to_user_id: number;
    fromUser?: {
        id: number;
        name: string;
        user_name: string;
    } | null;
    toUser?: {
        id: number;
        name: string;
        user_name: string;
    } | null;
}

interface Agent {
    id: number;
    name: string;
    user_name: string;
}

interface Props {
    agent: Agent;
    transferLogs: {
        data: TransferLog[];
        links: any[];
        meta: any;
    };
}

export default function AgentTransferLogs({ agent, transferLogs }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getTransactionIcon = (transfer: TransferLog) => {
        // If agent is the sender (money going out)
        if (transfer.from_user_id === agent.id) {
            return <ArrowUpRight className="h-4 w-4 text-red-500" />;
        }
        // If agent is the receiver (money coming in)
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    };

    const getTransactionType = (transfer: TransferLog) => {
        if (transfer.from_user_id === agent.id) {
            return 'Sent';
        }
        return 'Received';
    };

    const getTransactionColor = (transfer: TransferLog) => {
        if (transfer.from_user_id === agent.id) {
            return 'text-red-600';
        }
        return 'text-green-600';
    };

    const getOtherUser = (transfer: TransferLog) => {
        if (transfer.from_user_id === agent.id) {
            return transfer.toUser || { id: 0, name: 'Unknown User', user_name: 'N/A' };
        }
        return transfer.fromUser || { id: 0, name: 'Unknown User', user_name: 'N/A' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transfer Logs - ${agent.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/agents">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Transfer Logs
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Transaction history for {agent.name} ({agent.user_name})
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Transactions
                            </CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{transferLogs.meta?.total || 0}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Money Sent
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(
                                    transferLogs.data
                                        ?.filter(log => log.from_user_id === agent.id)
                                        ?.reduce((total, log) => total + log.amount, 0) || 0
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Money Received
                            </CardTitle>
                            <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(
                                    transferLogs.data
                                        ?.filter(log => log.to_user_id === agent.id)
                                        ?.reduce((total, log) => total + log.amount, 0) || 0
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transfer Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>
                            Complete transfer history for this agent
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Type</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Amount</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">To/From</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Description</th>
                                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transferLogs.data?.map((transfer) => (
                                        <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    {getTransactionIcon(transfer)}
                                                    <Badge variant={transfer.from_user_id === agent.id ? "destructive" : "default"}>
                                                        {getTransactionType(transfer)}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className={`border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium ${getTransactionColor(transfer)}`}>
                                                {formatCurrency(transfer.amount)}
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                <div>
                                                    <div className="font-medium">{getOtherUser(transfer).name}</div>
                                                    <div className="text-sm text-gray-500">{getOtherUser(transfer).user_name}</div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                {transfer.description}
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                {formatDate(transfer.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {(!transferLogs.data || transferLogs.data.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                No transfer logs found for this agent.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
