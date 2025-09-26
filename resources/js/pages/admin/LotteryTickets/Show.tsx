import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
// Route helper will be available globally
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle, Clock, XCircle, DollarSign, Calendar, User, CreditCard, Image } from 'lucide-react';

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
    payment_verified_by?: string;
    payment_verified_at?: string;
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

interface Props {
    ticket: LotteryTicket;
}

export default function Show({ ticket }: Props) {
    const [paymentStatus, setPaymentStatus] = useState(ticket.payment_status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusUpdate = (newStatus: string) => {
        setIsUpdating(true);
        
        router.patch(`/admin/lottery-tickets/${ticket.id}/payment-status`, {
            payment_status: newStatus,
            payment_verified_by: 'Admin'
        }, {
            onFinish: () => setIsUpdating(false),
            onSuccess: () => {
                setPaymentStatus(newStatus as 'pending' | 'completed' | 'failed');
            }
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title={`Lottery Ticket #${ticket.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/lottery-tickets"
                            className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Tickets
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
                            <p className="text-gray-600">Lottery ticket details</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {getStatusBadge(paymentStatus)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ticket Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Ticket Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Ticket ID</label>
                                    <p className="text-lg font-semibold">#{ticket.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Selected Digit</label>
                                    <div className="mt-1">
                                        <Badge variant="outline" className="text-lg px-3 py-1">
                                            {ticket.selected_digit}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Amount</label>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(ticket.amount)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Selected Date/Time</label>
                                <p className="text-lg">{formatDate(ticket.selected_datetime)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                                <div className="mt-2">
                                    <Select
                                        value={paymentStatus}
                                        onValueChange={handleStatusUpdate}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Player Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Player Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Player ID</label>
                                <p className="text-lg font-semibold">#{ticket.player_id}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Username</label>
                                <p className="text-lg">{ticket.player_user_name}</p>
                            </div>

                            {ticket.player && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-lg">{ticket.player.name}</p>
                                </div>
                            )}

                            {ticket.agent && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Agent</label>
                                    <div>
                                        <p className="text-lg font-semibold">{ticket.agent.name}</p>
                                        <p className="text-sm text-gray-500">@{ticket.agent.user_name}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                                <p className="text-lg">{ticket.payment_method}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Payment Reference</label>
                                <p className="text-lg font-mono">{ticket.payment_reference}</p>
                            </div>

                            {ticket.payment_completed_at && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Payment Completed At</label>
                                    <p className="text-lg">{formatDate(ticket.payment_completed_at)}</p>
                                </div>
                            )}

                            {ticket.payment_verified_by && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Verified By</label>
                                    <p className="text-lg">{ticket.payment_verified_by}</p>
                                </div>
                            )}

                            {ticket.payment_verified_at && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Verified At</label>
                                    <p className="text-lg">{formatDate(ticket.payment_verified_at)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Image */}
                    {ticket.payment_image && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Image className="w-5 h-5 mr-2" />
                                    Payment Proof
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border rounded-lg p-4">
                                        <img
                                            src={`/storage/${ticket.payment_image}`}
                                            alt="Payment proof"
                                            className="w-full h-auto rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                                            }}
                                        />
                                        <div className="hidden text-center text-gray-500 py-8">
                                            <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>Payment image not available</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(`/storage/${ticket.payment_image}`, '_blank')}
                                        >
                                            View Full Size
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate('completed')}
                                disabled={isUpdating || paymentStatus === 'completed'}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Completed
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate('failed')}
                                disabled={isUpdating || paymentStatus === 'failed'}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Mark as Failed
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate('pending')}
                                disabled={isUpdating || paymentStatus === 'pending'}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Mark as Pending
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
