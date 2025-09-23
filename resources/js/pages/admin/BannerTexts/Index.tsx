import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2,
    MessageSquare
} from 'lucide-react';
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
];

interface BannerText {
    id: number;
    text: string;
    admin_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    texts: BannerText[];
}

export default function BannerTextsIndex({ texts }: Props) {
    const handleDelete = (textId: number) => {
        if (confirm('Are you sure you want to delete this banner text?')) {
            router.delete(`/admin/banner-texts/${textId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banner Texts Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Banner Texts Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage banner texts for your application
                        </p>
                    </div>
                    <Link href="/admin/banner-texts/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Banner Text
                        </Button>
                    </Link>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Total Banner Texts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{texts.length}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Banner texts created
                        </p>
                    </CardContent>
                </Card>

                {/* Banner Texts List */}
                {texts.length > 0 ? (
                    <div className="space-y-4">
                        {texts.map((text) => (
                            <Card key={text.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                    <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Banner Text #{text.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Created {new Date(text.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {text.text}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Link href={`/admin/banner-texts/${text.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/banner-texts/${text.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDelete(text.id)}
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
                            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Banner Texts Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Get started by creating your first banner text.
                            </p>
                            <Link href="/admin/banner-texts/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Banner Text
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
