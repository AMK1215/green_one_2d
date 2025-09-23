import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2,
    Award
} from 'lucide-react';
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
];

interface WinnerText {
    id: number;
    text: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    texts: WinnerText[];
}

export default function WinnerTextsIndex({ texts }: Props) {
    const handleDelete = (textId: number) => {
        if (confirm('Are you sure you want to delete this winner text?')) {
            router.delete(`/admin/winner-texts/${textId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Winner Texts Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Winner Texts Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage winner announcement texts
                        </p>
                    </div>
                    <Link href="/admin/winner-texts/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Winner Text
                        </Button>
                    </Link>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Total Winner Texts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{texts.length}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Winner announcement texts created
                        </p>
                    </CardContent>
                </Card>

                {/* Winner Texts List */}
                {texts.length > 0 ? (
                    <div className="space-y-4">
                        {texts.map((text) => (
                            <Card key={text.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                                    <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Winner Text #{text.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Created {new Date(text.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-4 border-l-4 border-yellow-400">
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    🏆 {text.text}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Link href={`/admin/winner-texts/${text.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/winner-texts/${text.id}/edit`}>
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
                            <Award className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Winner Texts Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Get started by creating your first winner text.
                            </p>
                            <Link href="/admin/winner-texts/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Winner Text
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
