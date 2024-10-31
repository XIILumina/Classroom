import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react'; 
import { Link } from '@inertiajs/react'; 

export default function Courses({ auth, courses }) {
    const [selectedImage, setSelectedImage] = useState(null);

    // Загрузка изображения профиля
    useEffect(() => {
        fetch("/api/image/get")
            .then((response) => response.json())
            .then((data) => {
                setSelectedImage("/storage/" + data.photo[0]);
            });
    }, []);

    // Цвета фона и карточек
    const backgroundColor = 'bg-blue-50';
    const cardColors = [
        'bg-blue-100',
        'bg-green-100',
        'bg-yellow-100',
        'bg-purple-100',
        'bg-pink-100',
        'bg-indigo-100',
        'bg-teal-100',     
        'bg-red-100',      
        'bg-orange-100',   
        'bg-gray-100',     
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Courses" />
            <div className={`flex min-h-screen ${backgroundColor}`}>
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
                        <nav className="mt-4">
                            <ul>
                                <li className="mb-2">
                                    <a href="/dashboard" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200">
                                        Home Page
                                    </a>
                                </li>
                                <li className="mb-4">
                                    <a href="/Courses" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200">
                                        Courses
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-8">
                    <div className="flex items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mr-4">
                            Welcome, 
                            <Link href="/profile" className="text-blue-600 hover:underline ml-1">
                                {auth.user.name}!
                            </Link>
                        </h1>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                className="h-12 w-12 rounded-full object-cover border border-gray-300"
                                alt="Profile"
                            />
                        )}
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Courses:</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.isArray(courses) && courses.length > 0 ? (
                            courses.map((course, index) => (
                                <a
                                    key={course.id}
                                    href={`/courses/${course.id}`}
                                    className={`${cardColors[index % cardColors.length]} rounded-lg shadow-md p-6 h-64 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer block duration-200`}
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{course.name}</h3>
                                    <p className="text-gray-600 text-sm">
                                        Created on: {new Date(course.created_at).toLocaleString()}
                                    </p>
                                </a>
                            ))
                        ) : (
                            <p>No courses available yet.</p>
                        )}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
