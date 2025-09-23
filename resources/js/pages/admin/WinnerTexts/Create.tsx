import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Award } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: 'Winner Texts',
        href: '/admin/winner-texts',
    },
    {
        title: 'Create',
        href: '/admin/winner-texts/create',
    },
];

export default function WinnerTextCreate() {
    const { data, setData, post, processing, errors } = useForm({
        text: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/winner-texts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Winner Text" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/winner-texts">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Winner Texts
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Create New Winner Text
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Add a new winner text entry
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Winner Text Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details for your new winner text entry
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Text */}
                            <div className="space-y-2">
                                <Label htmlFor="text">Winner Text *</Label>
                                <Textarea
                                    id="text"
                                    value={data.text}
                                    onChange={(e) => setData('text', e.target.value)}
                                    placeholder="Enter winner text"
                                    rows={6}
                                    className={errors.text ? 'border-red-500' : ''}
                                />
                                {errors.text && (
                                    <p className="text-sm text-red-500">{errors.text}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Enter the text to display for winners
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Winner Text'}
                                </Button>
                                <Link href="/admin/winner-texts">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
