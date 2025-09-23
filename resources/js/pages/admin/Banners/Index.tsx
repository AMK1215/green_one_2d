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
    Image as ImageIcon
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Banners',
        href: '/admin/banners',
    },
];

interface Banner {
    id: number;
    image: string;
    admin_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    banners: Banner[];
}

export default function BannersIndex({ banners }: Props) {
    const handleDelete = (bannerId: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            router.delete(`/admin/banners/${bannerId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banners Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Banners Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage banner images for your application
                        </p>
                    </div>
                    <Link href="/admin/banners/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Banner
                        </Button>
                    </Link>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Total Banners
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{banners.length}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Banner images uploaded
                        </p>
                    </CardContent>
                </Card>

                {/* Banners Grid */}
                {banners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map((banner) => (
                            <Card key={banner.id} className="overflow-hidden">
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={`/assets/img/banners/${banner.image}`}
                                        alt={`Banner ${banner.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                ID: {banner.id}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {new Date(banner.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/banners/${banner.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/banners/${banner.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDelete(banner.id)}
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
                            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Banners Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Get started by adding your first banner image.
                            </p>
                            <Link href="/admin/banners/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Banner
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
