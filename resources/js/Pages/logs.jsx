import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Logs = ({ auth, logs = [] }) => {
    return (
        <AuthenticatedLayout user={auth}>
            <Head title="Admin Logs" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold mb-6 text-center">Admin Logs</h1>
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border border-gray-300 p-4 text-left">User</th>
                                <th className="border border-gray-300 p-4 text-left">Action</th>
                                <th className="border border-gray-300 p-4 text-left">Details</th>
                                <th className="border border-gray-300 p-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {logs.length > 0 ? (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-100 transition duration-200">
                                        <td className="border border-gray-300 p-4">{log.user?.name || 'Unknown User'}</td>
                                        <td className="border border-gray-300 p-4">{log.action}</td>
                                        <td className="border border-gray-300 p-4">{log.details || 'No details provided'}</td>
                                        <td className="border border-gray-300 p-4">{new Date(log.created_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="border border-gray-300 p-4 text-center text-gray-500">
                                        No logs available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Logs;
