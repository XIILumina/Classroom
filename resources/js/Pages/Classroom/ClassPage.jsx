import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia'; 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassPage = ({ classId, availableWorks, auth }) => { // 'auth' contains the authenticated user
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []); // Ensure works is an array

    const handleCreateWork = () => {
        Inertia.post('/api/works', {
            classId,
            title,
            description,
        }, {
            onSuccess: () => {
                setTitle('');
                setDescription('');
                fetchAvailableWorks();
            },
        });
    };

    const fetchAvailableWorks = () => {
        Inertia.get(`/api/classes/${classId}/works`, {
            onSuccess: (response) => {
                setWorks(Array.isArray(response.props.works) ? response.props.works : []); // Ensure response works is an array
            },
        });
    };

    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    return (
        <AuthenticatedLayout user={auth}> {/* Pass 'auth' as the 'user' */}
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                
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
