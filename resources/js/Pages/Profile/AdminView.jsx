import React from 'react';

function AdminView({ users, logs, onEditUser }) {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            
            <h2 className="text-xl mb-2">Users</h2>
            <ul className="list-disc list-inside">
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.role})
                        <button 
                            className="ml-2 text-blue-500 hover:underline"
                            onClick={() => onEditUser(user)}
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
            
            <h2 className="text-xl mt-4 mb-2">Action Logs</h2>
            <ul className="list-disc list-inside">
                {logs.map((log) => (
                    <li key={log.id}>{log.action}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdminView;
