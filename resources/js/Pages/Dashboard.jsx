import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Импортируем useEffect
import { Link } from '@inertiajs/react'; // Импортируем Link

export default function Dashboard({ auth, classes }) {
    const isAdminOrTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher';

    const { data, setData, post, errors } = useForm({
        name: '',
        teacher_id: auth.user.id,
        created_by: auth.user.id,
    });

    const [isFormVisible, setFormVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Состояние для изображения профиля

    // Загрузка изображения профиля
    useEffect(() => {
        fetch("/api/image/get")
            .then((response) => response.json())
            .then((data) => {
                setSelectedImage("/storage/" + data.photo[0]);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/class/create');
    };

    // Updated background color to a softer shade
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
            <Head title="Dashboard" />
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
                                {isAdminOrTeacher && (
                                    <li className="mt-6">
                                        <button 
                                            onClick={() => setFormVisible(!isFormVisible)} 
                                            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-500 transition duration-300 shadow-md w-full text-left"
                                        >
                                            Create New Class
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>

                    {/* Create New Class Form */}
                    {isFormVisible && (
                        <div className="p-6 border-t border-gray-200 mt-2">
                            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">New Class</h3>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className={`w-full p-2 border border-gray-300 rounded mb-2 ${errors.name ? 'border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-blue-400'}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter class name"
                                    />
                                    {errors.name && <p className="text-red-500 mt-2">{errors.name}</p>}
                                </div>
                                <button 
                                    type="submit" 
                                    className="bg-blue-600 text-white rounded p-2 hover:bg-blue-500 transition duration-300 shadow-md w-full"
                                >
                                    Create Class
                                </button>
                            </form>
                        </div>
                    )}
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
                        {/* Отображаем изображение профиля справа от приветственного сообщения */}
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                className="h-12 w-12 rounded-full object-cover border border-gray-300"
                                alt="Profile"
                            />
                        )}
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Classes</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {classes.map((classItem, index) => (
                            <a
                                key={classItem.id}
                                href={`/class/${classItem.id}`}
                                className={`${cardColors[index % cardColors.length]} rounded-lg shadow-md p-6 h-64 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer block duration-200`}
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">{classItem.name}</h3>
                                {/* Display the creation date and time */}
                                <p className="text-gray-600 text-sm">
                                    Created on: {new Date(classItem.created_at).toLocaleString()}
                                </p>
                            </a>
                        ))}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
