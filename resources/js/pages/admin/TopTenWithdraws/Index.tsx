import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2,
    Trophy,
    DollarSign
} from 'lucide-react';
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
];

interface TopTenWithdraw {
    id: number;
    player_id: number;
    amount: number;
    admin_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    texts: TopTenWithdraw[];
}

export default function TopTenWithdrawsIndex({ texts }: Props) {
    const handleDelete = (textId: number) => {
        if (confirm('Are you sure you want to delete this top ten withdraw entry?')) {
            router.delete(`/admin/top-ten-withdraws/${textId}`);
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
            <Head title="Top Ten Withdraws Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Top Ten Withdraws Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage top ten withdraw entries
                        </p>
                    </div>
                    <Link href="/admin/top-ten-withdraws/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Entry
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Total Entries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{texts.length}</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Top ten withdraw entries
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Total Amount
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {formatCurrency(texts.reduce((total, entry) => total + entry.amount, 0))}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Combined withdraw amount
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Average Amount
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {texts.length > 0 ? formatCurrency(texts.reduce((total, entry) => total + entry.amount, 0) / texts.length) : '$0.00'}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Average withdraw amount
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Ten Withdraws List */}
                {texts.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Ten Withdraws</CardTitle>
                            <CardDescription>
                                List of all top ten withdraw entries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {texts.map((entry, index) => (
                                    <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Player ID: {entry.player_id}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Added {new Date(entry.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                                {formatCurrency(entry.amount)}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/top-ten-withdraws/${entry.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/top-ten-withdraws/${entry.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDelete(entry.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Trophy className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Top Ten Withdraws Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Get started by adding your first top ten withdraw entry.
                            </p>
                            <Link href="/admin/top-ten-withdraws/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Entry
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
