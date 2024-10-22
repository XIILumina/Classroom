import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ users, logs }) {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <h2 className="text-lg mb-4">User Management</h2>
            <ul className="list-disc pl-5">
                {users.map(user => (
                    <li key={user.id}>
                        <Link to={`/admin/user/${user.id}/edit`} className="text-blue-500 hover:underline">
                            {user.name} ({user.role})
                        </Link>
                    </li>
                ))}
            </ul>

            <h2 className="text-lg mt-6 mb-4">Action History (Logs)</h2>
            <ul className="list-disc pl-5">
                {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
}
