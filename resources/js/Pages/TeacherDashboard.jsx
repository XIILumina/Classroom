import React, { useState } from 'react';

export default function TeacherDashboard({ classes }) {
    const [newClassName, setNewClassName] = useState('');

    const handleCreateClass = (e) => {
        e.preventDefault();
        // Submit form via axios or fetch to create the class
        console.log('Class created:', newClassName);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
            <h2 className="text-lg mb-4">Your Classes</h2>
            <ul className="list-disc pl-5">
                {classes.map(classItem => (
                    <li key={classItem.id}>
                        <a href={`/class/${classItem.id}`} className="text-blue-500 hover:underline">
                            {classItem.name}
                        </a>
                    </li>
                ))}
            </ul>

            <h2 className="text-lg mt-6 mb-4">Create New Class</h2>
            <form onSubmit={handleCreateClass}>
                <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Class Name"
                    className="border p-2 rounded-md"
                    required
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Create Class
                </button>
            </form>
        </div>
    );
}
