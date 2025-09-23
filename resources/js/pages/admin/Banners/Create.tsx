import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload } from 'lucide-react';
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
        title: 'Create',
        href: '/admin/banners/create',
    },
];

export default function BannerCreate() {
    const { data, setData, post, processing, errors } = useForm({
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/banners');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Banner" />

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
                                Create New Banner
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Upload a new banner image for your application
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Banner Information</CardTitle>
                        <CardDescription>
                            Upload an image to create a new banner. Supported formats: JPEG, PNG, JPG, GIF (max 2MB)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="image">Banner Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                    className="cursor-pointer"
                                />
                                {errors.image && (
                                    <p className="text-sm text-red-600">{errors.image}</p>
                                )}
                                {data.image && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Selected file: {data.image.name}
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
                                    <Upload className="h-4 w-4" />
                                    {processing ? 'Uploading...' : 'Upload Banner'}
                                </Button>
                                <Link href="/admin/banners">
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
