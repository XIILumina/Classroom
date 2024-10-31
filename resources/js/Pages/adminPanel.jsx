import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminPanel({ auth, users = [] }) {
    const isAdmin = auth.user.role === 'admin';

    // Handle delete action
    const handleDelete = (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(`/admin/users/${userId}`, {
                onSuccess: () => alert("User deleted successfully"),
            });
        }
    };

    // Handle edit action by redirecting to edit page
    const handleEdit = (userId) => {
        router.visit(`/admin/users/${userId}/edit`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Panel" />
            <div className="flex min-h-screen bg-gray-100">
                <aside className="w-64 bg-gray-900 text-white shadow-lg">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-2xl font-bold">Admin Panel</h2>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <Link href="/adminPanel" className="block px-4 py-3 hover:bg-gray-700 transition duration-200">User Management</Link>
                            </li>
                            <li>
                                <Link href="/logs" className="block px-4 py-3 hover:bg-gray-700 transition duration-200">View Logs</Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <div className="flex-1 p-10 bg-gray-100">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        {isAdmin ? (
                            <>
                                <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Management</h3>

                                {users.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {users.map((user) => (
                                            <div key={user.id} className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition duration-300">
                                                <h4 className="text-xl font-bold text-gray-900">{user.name}</h4>
                                                <div className="flex justify-between mb-4">
                                                    <span className="text-sm text-gray-500">{user.role}</span>
                                                    <span className={`text-sm ${user.active ? 'text-green-500' : 'text-red-500'}`}>
                                                        {user.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(user.id)} 
                                                        className="px-3 py-2 text-sm font-semibold text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)} 
                                                        className="px-3 py-2 text-sm font-semibold text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center mt-6">No users found.</p>
                                )}
                            </>
                        ) : (
                            <p className="text-lg text-gray-600 text-center">You do not have access to the admin panel.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
