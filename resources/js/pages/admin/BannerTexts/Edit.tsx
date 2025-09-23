import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageSquare, Save } from 'lucide-react';
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
        title: 'Edit Banner Text',
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

export default function BannerTextEdit({ text }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        text: text.text,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/banner-texts/${text.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Banner Text ${text.id}`} />

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
                                Edit Banner Text #{text.id}
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Update the banner text content
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Text */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Banner Text</CardTitle>
                            <CardDescription>
                                The current banner text content
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-900 dark:text-white">
                                    {text.text}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Banner Text</CardTitle>
                            <CardDescription>
                                Modify the banner text content
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
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Banner Text'}
                                    </Button>
                                    <Link href="/admin/banner-texts">
                                        <Button variant="outline">Cancel</Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
