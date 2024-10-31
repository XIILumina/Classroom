import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassPage = ({ classId, availableWorks, auth }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [visibleFileInputs, setVisibleFileInputs] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [newComment, setNewComment] = useState({});
    const [error, setError] = useState(null); // For error handling

    // Fetch works and comments
    const fetchAvailableWorks = async () => {
        try {
            const response = await fetch(`/class/${classId}/works`);
            const data = await response.json();
            setWorks(Array.isArray(data.works) ? data.works : []);
        } catch (error) {
            console.error('Error fetching works or comments:', error);
        }
    };

    // Handle work creation
    const handleCreateWork = async () => {
        try {
            const formData = new FormData();
            formData.append('classId', classId);
            formData.append('title', title);
            formData.append('description', description);
            if (file) {
                formData.append('file', file);
            }

            const response = await fetch(`/class/${classId}/works/store`, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                setFile(null);
                fetchAvailableWorks();
                setIsFormVisible(false);
            } else {
                console.error('Error creating work:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle status change
    const handleStatusChange = async (workId, currentStatus) => {
        const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';

        try {
            const response = await fetch(`/class/${classId}/works/${workId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setWorks((prevWorks) =>
                    prevWorks.map((work) =>
                        work.id === workId ? { ...work, status: newStatus } : work
                    )
                );
            } else {
                console.error('Error updating status:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle file selection
    const handleFileChange = (workId, file) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [workId]: file,
        }));
    };

    // Handle file upload
    const handleFileUpload = async (workId) => {
        const selectedFile = selectedFiles[workId];

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('workId', workId);

        try {
            const response = await fetch(`/class/${classId}/works/${workId}/add-file`, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            if (response.ok) {
                fetchAvailableWorks();
                alert("File uploaded successfully!");
            } else {
                console.error('Error uploading file:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle comment input change
    const handleCommentChange = (workId, value) => {
        setNewComment((prev) => ({
            ...prev,
            [workId]: value,
        }));
    };

    // Handle comment submission
    const handleCommentSubmit = async (workId) => {
        const commentText = newComment[workId];
        if (!commentText) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const response = await fetch(`/class/${classId}/works/${workId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ text: commentText }),
            });

            if (response.ok) {
                setNewComment((prev) => ({
                    ...prev,
                    [workId]: '', // Clear the comment input
                }));
                fetchAvailableWorks(); // Refresh works to include new comment
            } else {
                console.error('Error submitting comment:', response.statusText);
                setError('Failed to submit comment.'); // Set error message
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while submitting the comment.'); // Set error message
        }
    };

    // Fetch works and comments on component mount
    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    return (
        <AuthenticatedLayout user={auth}>
            <div className="flex min-h-screen bg-gray-100">
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

                    <div className="mt-6">
                        <button
                            onClick={() => setIsFormVisible(!isFormVisible)}
                            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-500 transition duration-300 shadow-md w-full text-left"
                        >
                            Create New Work
                        </button>
                        {isFormVisible && (
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

                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Class ID: {classId}</h1>

                    <div>
                        <h2 className="text-xl font-semibold">Available Works</h2>
                        <ul className="mt-4">
                            {works.length === 0 ? (
                                <li className="text-gray-500 italic">No works available.</li>
                            ) : (
                                works.map((work) => (
                                    <li key={work.id} className="border border-gray-300 p-4 rounded mb-4">
                                        <h3 className="font-bold">{work.title}</h3>
                                        <p>{work.description}</p>
                                        <p>Status: {work.status}</p>
                                        <button
                                            onClick={() => handleStatusChange(work.id, work.status)}
                                            className="mt-2 text-blue-600"
                                        >
                                            Change Status
                                        </button>

                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(work.id, e.target.files[0])}
                                            className="mt-2"
                                        />
                                        <button
                                            onClick={() => handleFileUpload(work.id)}
                                            className="mt-2 bg-green-600 text-white rounded p-1 hover:bg-green-500"
                                        >
                                            Upload File
                                        </button>

                                        <div className="mt-4">
                                            <h4 className="font-semibold">Comments</h4>
                                            <div>
                                                {work.comments && work.comments.length > 0 ? (
                                                    work.comments.map((comment) => (
                                                        <div key={comment.id} className="border border-gray-200 p-2 rounded mt-2">
                                                            {comment.text}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-500 italic">No comments yet.</div>
                                                )}
                                                <textarea
                                                    value={newComment[work.id] || ''}
                                                    onChange={(e) => handleCommentChange(work.id, e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="border border-gray-300 rounded p-2 w-full mt-2"
                                                ></textarea>
                                                <button
                                                    onClick={() => handleCommentSubmit(work.id)}
                                                    className="mt-2 bg-blue-600 text-white rounded p-1 hover:bg-blue-500"
                                                >
                                                    Submit Comment
                                                </button>
                                                {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
                                            </div>
                                        </div>
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
