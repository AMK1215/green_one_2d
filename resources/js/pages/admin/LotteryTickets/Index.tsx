import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Calendar, Filter, Eye, DollarSign, Users, Ticket, CheckCircle, Clock, XCircle } from 'lucide-react';

interface LotteryTicket {
    id: number;
    player_id: number;
    player_user_name: string;
    selected_digit: string;
    amount: number;
    selected_datetime: string;
    payment_status: 'pending' | 'completed' | 'failed';
    payment_method: string;
    payment_reference: string;
    payment_image?: string;
    payment_completed_at?: string;
    agent_id?: number;
    player?: {
        id: number;
        user_name: string;
        name: string;
    };
    agent?: {
        id: number;
        user_name: string;
        name: string;
    };
}

interface Agent {
    id: number;
    user_name: string;
    name: string;
}

interface AgentSummary {
    agent_id: number;
    agent_name: string;
    agent_display_name: string;
    ticket_count: number;
    total_amount: number;
    player_count: number;
    completed_count: number;
    pending_count: number;
}

interface Summary {
    total_tickets: number;
    total_amount: number;
    total_players: number;
    completed_payments: number;
    pending_payments: number;
    failed_payments: number;
    completed_amount: number;
    pending_amount: number;
}

interface Props {
    tickets: {
        data: LotteryTicket[];
        links: any[];
        meta: any;
    };
    summary: Summary;
    agents: Agent[];
    agentSummary: AgentSummary[];
    filters: {
        date_from?: string;
        date_to?: string;
        payment_status?: string;
        agent_id?: string;
    };
    userRole: number;
}

export default function Index({ tickets, summary, agents, agentSummary, filters, userRole }: Props) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Remove empty filters
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) {
                delete newFilters[k as keyof typeof newFilters];
            }
        });
        
        router.get(route('admin.lottery-tickets.index'), newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get(route('admin.lottery-tickets.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'failed':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US').format(amount) + ' MMK';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title="Lottery Tickets" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lottery Tickets</h1>
                        <p className="text-gray-600">Manage and view lottery ticket data</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_tickets}</div>
                            <p className="text-xs text-muted-foreground">
                                {summary.total_players} unique players
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_amount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(summary.completed_amount)} completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary.completed_payments}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(summary.completed_amount)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{summary.pending_payments}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(summary.pending_amount)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Agent Summary (Owner only) */}
                {userRole === 1 && agentSummary.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Agent Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {agentSummary.map((agent) => (
                                    <div key={agent.agent_id} className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-lg">{agent.agent_display_name}</h3>
                                        <p className="text-sm text-gray-600">@{agent.agent_name}</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Tickets:</span>
                                                <span className="font-medium">{agent.ticket_count}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Amount:</span>
                                                <span className="font-medium">{formatCurrency(agent.total_amount)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Players:</span>
                                                <span className="font-medium">{agent.player_count}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Completed:</span>
                                                <span className="font-medium text-green-600">{agent.completed_count}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Pending:</span>
                                                <span className="font-medium text-yellow-600">{agent.pending_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium">Date From</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Date To</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Payment Status</label>
                                <Select
                                    value={localFilters.payment_status || ''}
                                    onValueChange={(value) => handleFilterChange('payment_status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {userRole === 1 && (
                                <div>
                                    <label className="text-sm font-medium">Agent</label>
                                    <Select
                                        value={localFilters.agent_id || ''}
                                        onValueChange={(value) => handleFilterChange('agent_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Agents" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Agents</SelectItem>
                                            {agents.map((agent) => (
                                                <SelectItem key={agent.id} value={agent.id.toString()}>
                                                    {agent.name} (@{agent.user_name})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tickets Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Player</TableHead>
                                        <TableHead>Digit</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date/Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment Method</TableHead>
                                        {userRole === 1 && <TableHead>Agent</TableHead>}
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.data.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell className="font-medium">{ticket.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{ticket.player_user_name}</div>
                                                    {ticket.player && (
                                                        <div className="text-sm text-gray-500">{ticket.player.name}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{ticket.selected_digit}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(ticket.amount)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(ticket.selected_datetime)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(ticket.payment_status)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {ticket.payment_method}
                                            </TableCell>
                                            {userRole === 1 && (
                                                <TableCell>
                                                    {ticket.agent ? (
                                                        <div>
                                                            <div className="font-medium">{ticket.agent.name}</div>
                                                            <div className="text-sm text-gray-500">@{ticket.agent.user_name}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No Agent</span>
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Link
                                                    href={route('admin.lottery-tickets.show', ticket.id)}
                                                    className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {tickets.links && tickets.links.length > 3 && (
                            <div className="mt-4 flex justify-center">
                                <nav className="flex space-x-2">
                                    {tickets.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
