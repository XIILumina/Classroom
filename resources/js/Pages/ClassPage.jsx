import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia'; 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassPage = ({ classId, availableWorks, auth }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []);
    const [isFormVisible, setFormVisible] = useState(false);

    const handleCreateWork = () => {
        Inertia.post('/classroom/works', {
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
        Inertia.get(`/classroom/${classId}/works`, {
            onSuccess: (response) => {
                setWorks(Array.isArray(response.props.works) ? response.props.works : []);
            },
        });
    };

    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    return (
        <AuthenticatedLayout user={auth}>
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md border-r border-gray-200">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
                        <nav className="mt-4">
                            <ul>
                                <li className="mb-2">
                                    <button 
                                        onClick={() => setFormVisible(!isFormVisible)} 
                                        className="block w-full text-left p-3 text-gray-600 hover:bg-blue-100 rounded transition duration-200"
                                    >
                                        Create New Work
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Form for creating new work */}
                    {isFormVisible && (
                        <div className="p-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Work</h3>
                            <div className="bg-white p-4 rounded-lg shadow-md transition transform hover:scale-105">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Work Title"
                                    className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Work Description"
                                    className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                ></textarea>
                                <button
                                    onClick={handleCreateWork}
                                    className="bg-blue-600 text-white rounded-lg p-3 w-full hover:bg-blue-500 transition duration-300"
                                >
                                    Create Work
                                </button>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Works</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Works</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {works.length === 0 ? (
                            <li className="col-span-1 bg-white border border-gray-300 rounded-lg p-4 text-center">No works available.</li>
                        ) : (
                            works.map((work) => (
                                <li key={work.id} className="bg-white border border-gray-300 rounded-lg shadow p-4 transition transform hover:scale-105">
                                    <h3 className="font-bold text-xl text-gray-800">{work.title}</h3>
                                    <p className="text-gray-600 mt-2">{work.description}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClassPage;
