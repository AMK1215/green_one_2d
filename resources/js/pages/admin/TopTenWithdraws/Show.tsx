import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Edit, Trash2, Calendar } from 'lucide-react';
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
        title: 'View',
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

export default function TopTenWithdrawShow({ text }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this top ten withdraw entry? This action cannot be undone.')) {
            router.delete(`/admin/top-ten-withdraws/${text.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Top Ten Withdraw: ${text.amount}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/top-ten-withdraws">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Top Ten Withdraws
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Top Ten Withdraw Entry
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Amount: {text.amount}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/top-ten-withdraws/${text.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Top Ten Withdraw Information
                        </CardTitle>
                        <CardDescription>
                            Details about this top ten withdraw entry
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Amount
                            </h4>
                            <Badge variant="default" className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                                {text.amount}
                            </Badge>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Text
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {text.text}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Status
                            </h4>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                Active
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Created
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(text.created_at)}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Updated
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(text.updated_at)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
