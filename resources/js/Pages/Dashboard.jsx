import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Dashboard({ auth, classes }) {
    const isAdminOrTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher';

    // Initialize form state using Inertia's `useForm`
    const { data, setData, post, errors } = useForm({
        name: '',  // Class name
        teacher_id: auth.user.id // Automatically set teacher_id from the logged-in user
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/class/create'); // Make sure this matches the route in your web.php
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
                                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Class Name:</label>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                                    </div>
                                    
                                    {/* teacher_id is automatically set, no input needed */}

                                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
                                        Create Class
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
