import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2,
    Megaphone
} from 'lucide-react';
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
];

interface Promotion {
    id: number;
    title: string;
    description: string;
    image: string;
    admin_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    promotions: Promotion[];
}

export default function PromotionsIndex({ promotions }: Props) {
    const handleDelete = (promotionId: number) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            router.delete(`/admin/promotions/${promotionId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Promotions Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Promotions Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage promotional content for your application
                        </p>
                    </div>
                    <Link href="/admin/promotions/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Promotion
                        </Button>
                    </Link>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5" />
                            Total Promotions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{promotions.length}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Promotional campaigns created
                        </p>
                    </CardContent>
                </Card>

                {/* Promotions Grid */}
                {promotions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((promotion) => (
                            <Card key={promotion.id} className="overflow-hidden">
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={`/assets/img/promotions/${promotion.image}`}
                                        alt={promotion.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {promotion.title}
                                    </h3>
                                    {promotion.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {promotion.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {new Date(promotion.created_at).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/promotions/${promotion.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/promotions/${promotion.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDelete(promotion.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Megaphone className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Promotions Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Get started by creating your first promotion.
                            </p>
                            <Link href="/admin/promotions/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Promotion
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
