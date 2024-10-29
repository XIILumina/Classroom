import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, classes }) {
    const isAdminOrTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher';

    const { data, setData, post, errors } = useForm({
        name: '',
        teacher_id: auth.user.id,
        created_by: auth.user.id,
    });

    const [isFormVisible, setFormVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/class/create');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md border-r border-gray-200">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
                        <nav className="mt-4">
                            <ul>
                                <li className="mb-2">
                                    <a href="/dashboard" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200">
                                        Home Page
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="/Courses" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200">
                                        Courses
                                    </a>
                                </li>
                                {isAdminOrTeacher && (
                                    <li className="mb-2">
                                        <button 
                                            onClick={() => setFormVisible(!isFormVisible)} 
                                            className="block w-full text-left p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200"
                                        >
                                            Create New Class
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>

                    {isFormVisible && (
                        <div className="p-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Class</h3>
                            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md transition transform hover:scale-105">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Class Name</label>
                                    <input
                                        type="text"
                                        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ${errors.name ? 'border-red-500' : ''}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter class name"
                                    />
                                    {errors.name && <p className="text-red-500 mt-2">{errors.name}</p>}
                                </div>
                                <div className="flex justify-center">
                                    <button 
                                        type="submit" 
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 shadow-md"
                                    >
                                        Create Class
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {auth.user.name}!</h1>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Classes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((classItem) => (
                            <div
                                key={classItem.id}
                                className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{classItem.name}</h3>
                                <p className="text-gray-600">
                                    Created by: <span className="font-semibold">{classItem.created_by || 'Unknown'}</span>
                                </p>
                                <div className="mt-4">
                                    <a 
                                        href={`/class/${classItem.id}`} 
                                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300 shadow"
                                    >
                                        View Class
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
