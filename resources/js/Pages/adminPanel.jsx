import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminPanel({ auth, users = [] }) { // Default users to an empty array
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Panel</h2>}
        >
            <Head title="Admin Panel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {isAdmin ? (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">Manage Users</h3>
                                    {users.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                            {users.map((user) => (
                                                <li key={user.id} className="mb-2">
                                                    <span className="font-semibold">{user.name}</span> - {user.email}
                                                    <div className="flex space-x-2 mt-1">
                                                        <Link href={`/admin/user/edit/${user.id}`} className="text-blue-500 hover:underline">Edit</Link>
                                                        <Link href={`/admin/user/delete/${user.id}`} className="text-red-500 hover:underline">Delete</Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600">No users found.</p>
                                    )}

                                    <h3 className="text-lg font-semibold mt-6">More Actions:</h3>
                                    <Link href="/logs" className="text-blue-500 hover:underline">View Logs</Link>
                                </>
                            ) : (
                                <p>You do not have access to the admin panel.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
