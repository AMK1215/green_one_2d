import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Edit, Trash2, Calendar } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Winner Texts',
        href: '/admin/winner-texts',
    },
    {
        title: 'View',
        href: '#',
    },
];

interface WinnerText {
    id: number;
    text: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    winnerText: WinnerText;
}

export default function WinnerTextShow({ winnerText }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this winner text? This action cannot be undone.')) {
            router.delete(`/admin/winner-texts/${winnerText.id}`);
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
            <Head title="Winner Text Details" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/winner-texts">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Winner Texts
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Winner Text Details
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                View and manage winner text entry
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/winner-texts/${winnerText.id}/edit`}>
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
                            <Award className="h-5 w-5" />
                            Winner Text Information
                        </CardTitle>
                        <CardDescription>
                            Details about this winner text entry
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Winner Text
                            </h4>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {winnerText.text}
                                </p>
                            </div>
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
                                    {formatDate(winnerText.created_at)}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Updated
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(winnerText.updated_at)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
