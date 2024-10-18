import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, classes }) {
    const [newClass, setNewClass] = useState('');
    const isAdminOrTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher';

    const handleCreateClass = (e) => {
        e.preventDefault();
        // Submit class creation to backend, typically using axios or Inertia's post method
        console.log('Class Created:', newClass);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Available Classes</h3>
                            <ul className="list-disc pl-5">
                                {classes.map((classItem) => (
                                    <li key={classItem.id}>
                                        <a href={`/class/${classItem.id}`} className="text-blue-500 hover:underline">
                                            {classItem.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {isAdminOrTeacher && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Create a New Class</h3>
                                    <form onSubmit={handleCreateClass}>
                                        <input
                                            type="text"
                                            value={newClass}
                                            onChange={(e) => setNewClass(e.target.value)}
                                            placeholder="Class Name"
                                            className="border p-2 rounded-md"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                        >
                                            Create Class
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
