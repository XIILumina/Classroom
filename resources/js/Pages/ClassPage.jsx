import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassPage = ({ classId, availableWorks, auth }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []); // Ensure works is an array

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
        <AuthenticatedLayout user={auth}> {/* Pass 'auth' as the 'user' */}
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Class ID: {classId}</h1> {/* Display classId */}

                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Create New Work</h2>
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
                            onClick={handleCreateWork}
                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        >
                            Create Work
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Available Works</h2>
                    <ul className="mt-4">
                        {works.length === 0 ? (
                            <li>No works available.</li>
                        ) : (
                            works.map((work) => (
                                <li key={work.id} className="border p-2 rounded mb-2">
                                    <h3 className="font-bold">{work.title}</h3>
                                    <p>{work.description}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClassPage;
