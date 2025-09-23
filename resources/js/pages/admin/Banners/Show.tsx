import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, User } from 'lucide-react';
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
    {
        title: 'View Banner',
        href: '#',
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
    banner: Banner;
}

export default function BannerShow({ banner }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Banner ${banner.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/banners">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Banners
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Banner #{banner.id}
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                View banner details and image
                            </p>
                        </div>
                    </div>
                    <Link href={`/admin/banners/${banner.id}/edit`}>
                        <Button className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Banner
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Banner Image */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Banner Image</CardTitle>
                                <CardDescription>
                                    Full size banner image display
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <img
                                        src={`/assets/img/banners/${banner.image}`}
                                        alt={`Banner ${banner.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Banner Details */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Banner Details</CardTitle>
                                <CardDescription>
                                    Information about this banner
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Admin ID
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {banner.admin_id}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Created At
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(banner.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Updated At
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(banner.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
