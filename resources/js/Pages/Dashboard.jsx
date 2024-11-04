import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Импортируем useEffect
import { Link } from '@inertiajs/react'; // Импортируем Link

export default function Dashboard({ auth, classes, teacher_id, users = [], classrooms }) {
    
    // Check if `auth` and `auth.user` exist before accessing `role`
    const isAdminOrTeacher = auth && auth.user && (auth.user.role === 'admin' || auth.user.role === 'teacher');
console.log(classrooms);
    const { data, setData, post, errors } = useForm({
        name: '',
        teacher_id: auth?.user?.id || '', // Use optional chaining here
        created_by: auth?.user?.id || '', // Use optional chaining here
    });

    const [isFormVisible, setFormVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userModalVisible, setUserModalVisible] = useState(false); // Lietotāju modāļa parādīšana
    const [allUsers, setAllUsers] = useState([]); // Tiek glabāti visi lietotāji
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
const [loadingUsers, setLoadingUsers] = useState(false);
const [loadingClassCreation, setLoadingClassCreation] = useState(false);

    // Fetch the profile image
    useEffect(() => {
        fetch("/api/image/get")
            .then((response) => response.json())
            .then((data) => {
                setSelectedImage("/storage/" + data.photo[0]);
            });
    }, []);
useEffect(() => {
    if (userModalVisible) {
        fetch('/users')
            .then((response) => response.json())
            .then((data) => {
                setAllUsers(data);
            })
            .catch((error) => console.error("Error loading users:", error));
    }
}, [userModalVisible]);


const handleSubmit = (e) => {
    e.preventDefault();
    post('/class/create', {
        onSuccess: () => {
            // Pēc veiksmīgas klases izveides atjaunojam datus (tikai skolotāja klases)
            setData('name', ''); // Iztīra ievades lauku
        },
        onError: (error) => {
            console.error("Error creating class:", error);
            alert("Error: " + error.response.data.message);
        },
    });
};
    

const handleAddUserToClassroom = (userId, classroomId) => {
    if (classroomId && userId) {
        const postData = {
            classroom_id: classroomId,
            user_ids: [userId],
        };
        console.log("Posting data:", postData); // Log the data being sent

        post('/class/add-users', postData, {
            onSuccess: () => {
                console.log("User added successfully");
                setUserModalVisible(false);
            },
            onError: (error) => {
                console.error("Error adding user to classroom:", error);
                alert("Error: " + (error.response?.data?.message || "An error occurred"));
            },
        });
    } else {
        console.error("Classroom ID or User ID is not set.");
        alert("Please select a user and classroom before adding.");
    }
};








    // fetch('/users')
    // .then((response) => {
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    // })
    // .then((data) => setAllUsers(data))
    // .catch((error) => console.error("Error loading users:", error));

    return (
        <AuthenticatedLayout user={auth?.user}>
            {/* Only render this section if `auth.user` exists */}
            {auth?.user ? (
                <>
                    <Head title="Dashboard" />
                    <div className={`flex min-h-screen bg-blue-50`}>
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
                                    />
                                )}
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Classes:</h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {classrooms.map((classroom) => (
                                    <div
                                        key={classroom.id}
                                        className="bg-blue-100 rounded-lg shadow-md p-6 h-64 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer block duration-200"
                                        onClick={() => window.location.href = `/class/${classroom.id}/show`}
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">{classroom.name}</h3>
                                        
                                        {/* Add Users Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents the parent div's onClick from firing
                                                setSelectedClassroomId(classroom.id);
                                                setUserModalVisible(true);
                                            }}
                                            className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-400"
                                        >
                                            Add Users
                                        </button>

                                        <p className="text-gray-600 text-sm">
                                            Created on: {new Date(classroom.created_at).toLocaleString()}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Created by: {classroom.teacher ? classroom.teacher.name : "Unknown"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </main>

                    </div>


                    {/* User Modal */}
                    {userModalVisible && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded shadow-lg w-1/2 max-w-lg">
                                <h2 className="text-2xl font-semibold mb-4">Select Users to Add</h2>
                                <ul>
                                {allUsers.length > 0 ? (
                                                    allUsers.map((user) => (
                                                        <li key={user.id} className="mb-2">
                                                            <button
                                                                onClick={() => handleAddUserToClassroom(user.id, selectedClassroomId)} // Pievienots classroomId
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {user.name}
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-600">No users available.</p>
                                                )}
                                </ul>
                                <button
                                    onClick={() => setUserModalVisible(false)}
                                    className="mt-4 bg-gray-300 py-1 px-3 rounded hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                </>
            ) : (
                <p>Loading...</p>
            )}
        </AuthenticatedLayout>
    );
}
