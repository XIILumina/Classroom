import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Works = ({ classId, availableWorks, auth }) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []);
    const [isEditing, setIsEditing] = useState(false);
    const [editWorkId, setEditWorkId] = useState(null);

    // Fetch available works
    const fetchAvailableWorks = async () => {
        try {
            const response = await fetch(`/api/class/${classId}/works`);
            const data = await response.json();
            setWorks(Array.isArray(data.works) ? data.works : []);
        if (!classId) {
            console.error('classId is undefined');
            return;
        }
        } catch (error) {
            console.error('Error fetching works:', error);
        }
    };

    // Create or Update work
    const handleSaveWork = async () => {
        const url = isEditing 
            ? `/api/class/${classId}/works/${editWorkId}` 
            : `/api/class/${classId}/works`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ title, description, classId }), // Add classId here
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                setIsEditing(false);
                fetchAvailableWorks(); // Refresh works
            } else {
                console.error('Error saving work:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Edit work
    const handleEditWork = (work) => {
        setTitle(work.title);
        setDescription(work.description);
        setIsEditing(true);
        setEditWorkId(work.id);
    };

    // Delete work
    const handleDeleteWork = async (workId) => {
        try {
            const response = await fetch(`/api/class/${classId}/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
            });

            if (response.ok) {
                fetchAvailableWorks(); // Refresh works
            } else {
                console.error('Error deleting work:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    return (
        <AuthenticatedLayout user={auth}>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Class ID: {classId}</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold">{isEditing ? 'Edit Work' : 'Create New Work'}</h2>
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
                            onClick={handleSaveWork}
                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        >
                            {isEditing ? 'Update Work' : 'Create Work'}
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
                                    <button onClick={() => handleEditWork(work)} className="mr-2">Edit</button>
                                    <button onClick={() => handleDeleteWork(work.id)} className="text-red-500">Delete</button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Works;
