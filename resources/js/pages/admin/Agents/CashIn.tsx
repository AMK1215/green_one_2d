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
        title: 'Cash In',
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
    ownerBalance: number;
}

export default function AgentCashIn({ agent, ownerBalance }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/agents/${agent.id}/cash-in`);
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
            <Head title={`Deposit to ${agent.name}`} />

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
                            Deposit to Agent
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Transfer money from your account to {agent.name}
                        </p>
                    </div>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Your Balance
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(ownerBalance)}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Agent Balance
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(agent.balanceFloat)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Agent Balance */}
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader>
                        <CardTitle className="text-blue-800 dark:text-blue-200">Agent Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(agent.balanceFloat)}
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {agent.name} ({agent.user_name})
                        </p>
                    </CardContent>
                </Card>

                {/* Transfer Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Deposit Money</CardTitle>
                        <CardDescription>
                            Transfer money to {agent.name} ({agent.user_name})
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
                                    max={ownerBalance}
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Enter amount to transfer"
                                    required
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-600">{errors.amount}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Maximum: {formatCurrency(ownerBalance)}
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
                                    {processing ? 'Processing...' : 'Deposit Money'}
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
                                <span className="text-gray-600">Current Balance:</span>
                                <span className="font-medium text-blue-600">
                                    {formatCurrency(agent.balanceFloat)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
