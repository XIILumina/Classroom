import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

const ClassPage = ({ classId, availableWorks }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [works, setWorks] = useState(availableWorks);

    const handleCreateWork = () => {
        // Call the API to create a new work
        Inertia.post('/api/works', {
            classId,
            title,
            description,
        }, {
            onSuccess: () => {
                // Reset the form fields
                setTitle('');
                setDescription('');
                // Optionally fetch updated works
                fetchAvailableWorks();
            },
        });
    };

    const fetchAvailableWorks = () => {
        // Fetch available works for the class
        Inertia.get(`/api/classes/${classId}/works`, {
            onSuccess: (response) => {
                setWorks(response.props.works); // Adjust according to your API response
            },
        });
    };

    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Class Works</h1>
            
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
    );
};

export default ClassPage;
