import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageSquare } from 'lucide-react';
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
        title: 'Create',
        href: '/admin/banner-texts/create',
    },
];

export default function BannerTextCreate() {
    const { data, setData, post, processing, errors } = useForm({
        text: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/banner-texts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Banner Text" />

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
                                Create New Banner Text
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Add a new banner text for your application
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Banner Text Information
                        </CardTitle>
                        <CardDescription>
                            Create a new banner text that will be displayed on your application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="text">Banner Text</Label>
                                <Textarea
                                    id="text"
                                    value={data.text}
                                    onChange={(e) => setData('text', e.target.value)}
                                    placeholder="Enter your banner text here..."
                                    required
                                    rows={4}
                                    className="resize-none"
                                />
                                {errors.text && (
                                    <p className="text-sm text-red-600">{errors.text}</p>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    This text will be displayed as a banner message on your application.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Banner Text'}
                                </Button>
                                <Link href="/admin/banner-texts">
                                    <Button variant="outline">Cancel</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
