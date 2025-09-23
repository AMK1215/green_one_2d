import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, User, MessageSquare } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Banner Texts',
        href: '/admin/banner-texts',
    },
    {
        title: 'View Banner Text',
        href: '#',
    },
];

interface BannerText {
    id: number;
    text: string;
    admin_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    text: BannerText;
}

export default function BannerTextShow({ text }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Banner Text ${text.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/banner-texts">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Banner Texts
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Banner Text #{text.id}
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                View banner text details
                            </p>
                        </div>
                    </div>
                    <Link href={`/admin/banner-texts/${text.id}/edit`}>
                        <Button className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Banner Text
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Banner Text Content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Banner Text Content
                                </CardTitle>
                                <CardDescription>
                                    The banner text that will be displayed
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                    <p className="text-lg text-gray-900 dark:text-white">
                                        {text.text}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Banner Text Details */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Banner Text Details</CardTitle>
                                <CardDescription>
                                    Information about this banner text
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
                                            {text.admin_id}
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
                                            {new Date(text.created_at).toLocaleString()}
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
                                            {new Date(text.updated_at).toLocaleString()}
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
