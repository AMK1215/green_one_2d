import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Save } from 'lucide-react';
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
        title: 'Edit Banner',
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

export default function BannerEdit({ banner }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        image: null as File | null,
        _method: 'PUT' as string,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/banners/${banner.id}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Banner ${banner.id}`} />

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
                                Edit Banner #{banner.id}
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Update the banner image
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Banner</CardTitle>
                            <CardDescription>
                                The current banner image
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <img
                                    src={`/assets/img/banners/${banner.image}`}
                                    alt={`Current Banner ${banner.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Banner</CardTitle>
                            <CardDescription>
                                Upload a new image to replace the current banner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="image">New Banner Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-600">{errors.image}</p>
                                    )}
                                    {data.image && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                New image preview:
                                            </p>
                                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(data.image)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Banner'}
                                    </Button>
                                    <Link href="/admin/banners">
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
