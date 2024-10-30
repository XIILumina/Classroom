import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassPage = ({ classId, availableWorks, auth }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []); // Ensure works is an array
    const [isFormVisible, setIsFormVisible] = useState(false); // State to manage form visibility

    // Function to fetch available works for the class
    const fetchAvailableWorks = async () => {
        try {
            const response = await fetch(`/api/classes/${classId}/works`);
            const data = await response.json();
            setWorks(Array.isArray(data.works) ? data.works : []); // Ensure response works is an array
        } catch (error) {
            console.error('Error fetching works:', error);
        }
    };

    // Function to create a new work
    const handleCreateWork = async () => {
        try {
            const response = await fetch('/api/classroom/works', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content, // Include CSRF token
                },
                body: JSON.stringify({
                    classId,
                    title,
                    description,
                }),
            });

            if (response.ok) {
                setTitle(''); // Reset the title
                setDescription(''); // Reset the description
                fetchAvailableWorks(); // Re-fetch the works
                setIsFormVisible(false); // Hide form after creation
            } else {
                console.error('Error creating work:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch works when the component mounts or when classId changes
    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    return (
        <AuthenticatedLayout user={auth}>
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
                    <nav className="mt-4">
                        <ul>
                            <li className="mb-2">
                                <a href="/dashboard" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200">
                                    Home Page
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/courses" className="block p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200">
                                    Courses
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Create New Work Toggle */}
                    <div className="mt-6">
                        <button
                            onClick={() => setIsFormVisible(!isFormVisible)} // Toggle form visibility
                            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-500 transition duration-300 shadow-md w-full text-left"
                        >
                            Create New Work
                        </button>
                        {isFormVisible && ( // Conditionally render the form
                            <form onSubmit={(e) => { e.preventDefault(); handleCreateWork(); }} className="bg-white p-4 rounded-lg shadow-md mt-2">
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Work Title"
                                        className="border border-gray-300 rounded p-2 w-full mb-2"
                                    />
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Work Description"
                                        className="border border-gray-300 rounded p-2 w-full mb-2"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-500 transition duration-300 shadow-md"
                                    >
                                        Create Work
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Class ID: {classId}</h1>

                    <div>
                        <h2 className="text-xl font-semibold">Available Works</h2>
                        <ul className="mt-4">
                            {works.length === 0 ? (
                                <li>No works available.</li>
                            ) : (
                                works.map((work) => (
                                    <li key={work.id} className="border p-4 rounded mb-2 bg-white shadow-md">
                                        <h3 className="font-bold">{work.title}</h3>
                                        <p>{work.description}</p>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClassPage;
