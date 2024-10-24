import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Logs({ auth, logs }) {
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Logs</h2>}
        >
            <Head title="User Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Activity Logs</h3>
                            {isAdmin ? (
                                <ul className="list-disc pl-5">
                                    {logs.map((log) => (
                                        <li key={log.id}>
                                            <span>{log.created_at}: </span>
                                            <span className="font-semibold">{log.user_name}</span> performed <span>{log.action}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>You do not have permission to view logs.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
