import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Megaphone, Edit, Trash2, Calendar } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Promotions',
        href: '/admin/promotions',
    },
    {
        title: 'View',
        href: '#',
    },
];

interface Promotion {
    id: number;
    title: string;
    description: string;
    image: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    promotion: Promotion;
}

export default function PromotionShow({ promotion }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
            router.delete(`/admin/promotions/${promotion.id}`);
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
            <Head title={`Promotion: ${promotion.title}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/promotions">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Promotions
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {promotion.title}
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Promotion Details
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/promotions/${promotion.id}/edit`}>
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

                {/* Promotion Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5" />
                                Promotion Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video w-full overflow-hidden rounded-md border">
                                <img
                                    src={`/assets/img/promotions/${promotion.image}`}
                                    alt={promotion.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Promotion Information</CardTitle>
                            <CardDescription>
                                Details about this promotional campaign
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Title
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {promotion.title}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Description
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                    {promotion.description}
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
                                        {formatDate(promotion.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Updated
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(promotion.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
