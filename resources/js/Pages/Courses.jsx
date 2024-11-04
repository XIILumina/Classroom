import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ auth, classes }) {
    const isAdminOrTeacher = auth.user.role === 'admin' || auth.user.role === 'teacher';

    // Form setup using Inertia
    const { post } = useForm({
        name: '',
        teacher_id: auth.user.id,
        created_by: auth.user.id,
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [courses, setCourses] = useState(classes || []);
    const [showModal, setShowModal] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [newCourse, setNewCourse] = useState(null);

    // Fetch profile image on mount
    useEffect(() => {
        fetch("/api/image/get")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.photo.length > 0) {
                    setSelectedImage("/storage/" + data.photo[0]);
                }
            })
            .catch((error) => console.error('Failed to fetch image:', error));
    }, []);

    const handleCourseSubmit = async (e) => {
        e.preventDefault();

        // Check if course name is provided
        if (!courseName) {
            alert("Course name is required!");
            return;
        }

        const newInviteCode = generateInviteCode();
        setInviteCode(newInviteCode);
        setShowInviteModal(true);

        // post('/course/create', { name: courseName, invite_code: newInviteCode }, {
        //     onSuccess: (response) => {
        //         // Update courses list upon successful creation
        //         setCourses((prevCourses) => [...prevCourses, response.course]);
        //         setCourseName('');
        //         setShowModal(false);
        //         setNewCourse(response.course); // Save the new course
        //     },
        //     onError: (error) => {
        //         console.error('Failed to create course:', error);
        //         alert('Failed to create course: ' + (error.message || 'An error occurred'));
        //     }
        // });
    };

    const generateInviteCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };

    const handleCancel = () => {
        setShowModal(false);
        setCourseName('');
        setNewCourse(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Home Page" />
            <div className="flex min-h-screen bg-blue-50">
                <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
                        <nav className="mt-4">
                            <ul>
                                <li className="mb-2">
                                    <Link href="/dashboard" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200"> Home Page </Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/Courses" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200"> Courses </Link>
                                </li>
                                {isAdminOrTeacher && (
                                    <li className="mt-6">
                                        <button 
                                            onClick={() => setShowModal(true)} 
                                            className="bg-green-600 text-white rounded p-2 hover:bg-green-500 transition duration-300 shadow-md w-full text-left">
                                            Create Course
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 p-8">
                    <div className="container mx-auto">
                        <div className="flex items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 mr-4">
                                Welcome,
                                <Link href="/profile" className="text-blue-600 hover:underline ml-1">
                                    {auth.user.name}!
                                </Link>
                            </h1>
                            {selectedImage && (
                                <img src={selectedImage} className="h-12 w-12 rounded-full object-cover border border-gray-300" alt="User Profile" />
                            )}
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Courses:</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {courses.length > 0 ? (
                                courses.map((course, index) => (
                                    <a key={course.id} href={`/course/${course.id}/show`} className={`bg-blue-100 rounded-lg shadow-md p-6 h-64 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer block duration-200`}>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">{course.name}</h3>
                                        <p className="text-gray-600 text-sm">Created on: {new Date(course.created_at).toLocaleString()}</p>
                                    </a>
                                ))
                            ) : (
                                <p className="text-gray-600">No courses available.</p>
                            )}
                        </div>

                        {showInviteModal && newCourse && (
                            <div className="mt-8 p-4 bg-green-100 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold mb-2">New Course Created!</h3>
                                <p className="text-gray-800 mb-1">Course Name: <span className="font-bold">{newCourse.name}</span></p>
                                <p className="text-gray-800">Invite Code: <span className="font-bold text-blue-600">{inviteCode}</span></p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Create a Course</h3>
                        <form onSubmit={handleCourseSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Name
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border border-gray-300 rounded mb-2 focus:ring-blue-400`}
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    placeholder="Enter course name"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 mr-2"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showInviteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Invite Code Generated</h3>
                        <p className="mb-4">Your invite code is: <span className="font-bold text-blue-600">{inviteCode}</span></p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
