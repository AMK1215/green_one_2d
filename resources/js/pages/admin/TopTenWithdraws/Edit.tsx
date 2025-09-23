import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Trophy } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Top Ten Withdraws',
        href: '/admin/top-ten-withdraws',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface TopTenWithdraw {
    id: number;
    text: string;
    amount: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    text: TopTenWithdraw;
}

export default function TopTenWithdrawEdit({ text }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        text: text.text,
        amount: text.amount,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/top-ten-withdraws/${text.id}`, {
            method: 'put',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Top Ten Withdraw" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/top-ten-withdraws">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Top Ten Withdraws
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Edit Top Ten Withdraw
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Update top ten withdraw details
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Top Ten Withdraw Details
                        </CardTitle>
                        <CardDescription>
                            Update the details for your top ten withdraw entry
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Text */}
                            <div className="space-y-2">
                                <Label htmlFor="text">Text *</Label>
                                <Textarea
                                    id="text"
                                    value={data.text}
                                    onChange={(e) => setData('text', e.target.value)}
                                    placeholder="Enter top ten withdraw text"
                                    rows={4}
                                    className={errors.text ? 'border-red-500' : ''}
                                />
                                {errors.text && (
                                    <p className="text-sm text-red-500">{errors.text}</p>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Enter amount"
                                    className={errors.amount ? 'border-red-500' : ''}
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-500">{errors.amount}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Top Ten Withdraw'}
                                </Button>
                                <Link href="/admin/top-ten-withdraws">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
