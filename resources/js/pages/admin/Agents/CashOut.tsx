import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign, Wallet } from 'lucide-react';
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
        title: 'Cash Out',
        href: '#',
    },
];

interface Agent {
    id: number;
    name: string;
    user_name: string;
    balanceFloat: number;
}

interface Props {
    agent: Agent;
    agentBalance: number;
}

export default function AgentCashOut({ agent, agentBalance }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/agents/${agent.id}/cash-out`);
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
            <Head title={`Withdraw from ${agent.name}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/agents">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Withdraw from Agent
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Transfer money from {agent.name} to your account
                        </p>
                    </div>
                </div>

                {/* Current Agent Balance */}
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader>
                        <CardTitle className="text-blue-800 dark:text-blue-200">Agent Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(agentBalance)}
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {agent.name} ({agent.user_name})
                        </p>
                    </CardContent>
                </Card>

                {/* Withdraw Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Withdraw Money</CardTitle>
                        <CardDescription>
                            Transfer money from {agent.name} ({agent.user_name}) to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={agentBalance}
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Enter amount to withdraw"
                                    required
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-600">{errors.amount}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Maximum: {formatCurrency(agentBalance)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note">Note (Optional)</Label>
                                <Input
                                    id="note"
                                    type="text"
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Add a note for this transaction"
                                />
                                {errors.note && (
                                    <p className="text-sm text-red-600">{errors.note}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing || !data.amount || parseFloat(data.amount) <= 0}
                                    className="flex-1"
                                >
                                    {processing ? 'Processing...' : 'Withdraw Money'}
                                </Button>
                                <Link href="/admin/agents">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Agent Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agent Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">{agent.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Username:</span>
                                <span className="font-medium">{agent.user_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Available Balance:</span>
                                <span className="font-medium text-blue-600">
                                    {formatCurrency(agentBalance)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
