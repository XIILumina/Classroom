import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ClassPage = ({ classId, availableWorks, auth }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [works, setWorks] = useState(Array.isArray(availableWorks) ? availableWorks : []);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [newComment, setNewComment] = useState({});
    const [error, setError] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    const fetchAvailableWorks = async () => {
        try {
            const response = await fetch(`/class/${classId}/works`); // исправлено добавление кавычек
            const data = await response.json();
            setWorks(Array.isArray(data.works) ? data.works : []);
        } catch (error) {
            console.error('Error fetching works or comments:', error);
        }
    };

    const handleCreateWork = async () => {
        // Логика создания работы
    };

    const handleStatusChange = async (workId, currentStatus) => {
        // Логика изменения статуса
    };

    const handleFileChange = (workId, file) => {
        // Логика изменения файла
    };

    const handleFileUpload = async (workId) => {
        // Логика загрузки файла
    };

    const handleCommentChange = (workId, value) => {
        setNewComment((prev) => ({
            ...prev,
            [workId]: value,
        }));
    };

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
                    [workId]: '',
                }));
                fetchAvailableWorks();
            } else {
                setError('Failed to submit comment.');
            }
        } catch (error) {
            setError('An error occurred while submitting the comment.');
        }
    };

    const handleEditComment = (commentId, currentText) => {
        setEditingCommentId(commentId);
        setEditedComment(currentText);
    };

    const handleEditCommentSubmit = async (workId, commentId) => {
        if (!editedComment) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const response = await fetch(`/class/${classId}/works/${workId}/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ text: editedComment }),
            });

            if (response.ok) {
                setEditingCommentId(null);
                setEditedComment('');
                fetchAvailableWorks();
            } else {
                setError('Failed to update comment.');
            }
        } catch (error) {
            setError('An error occurred while updating the comment.');
        }
    };

    const handleDeleteComment = async (workId, commentId) => {
        try {
            const response = await fetch(`/class/${classId}/works/${workId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            if (response.ok) {
                fetchAvailableWorks();
            } else {
                setError('Failed to delete comment.');
            }
        } catch (error) {
            setError('An error occurred while deleting the comment.');
        }
    };

    useEffect(() => {
        fetchAvailableWorks();
    }, [classId]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100';
            case 'pending':
                return 'bg-yellow-100';
            case 'rejected':
                return 'bg-red-100';
            default:
                return 'bg-white';
        }
    };

    return (
        <AuthenticatedLayout user={auth}>
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 bg-white shadow-lg border-r border-gray-200 p-6">
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
                        <h2 className="text-xl font-semibold mb-2">Available Works</h2>
                        <ul className="mt-4">
                            {works.length === 0 ? (
                                <li className="text-gray-500 italic">No works available.</li>
                            ) : (
                                works.map((work) => (
                                    <li key={work.id} className={`border border-gray-300 p-4 rounded-lg mb-4 ${getStatusClass(work.status)}`}>
                                        <h3 className="font-bold text-lg">{work.title}</h3>
                                        <p className="text-gray-700">{work.description}</p>
                                        <p className="text-sm text-gray-500">Status: {work.status}</p>

                                        {work.comments && work.comments.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold">Comments</h4>
                                                {work.comments.map((comment) => (
                                                    <div key={comment.id} className="border border-gray-200 p-2 rounded mt-2 bg-gray-50">
                                                        {editingCommentId === comment.id ? (
                                                            <div>
                                                                <textarea
                                                                    value={editedComment}
                                                                    onChange={(e) => setEditedComment(e.target.value)}
                                                                    className="border border-gray-300 rounded p-2 w-full"
                                                                ></textarea>
                                                                <button
                                                                    onClick={() => handleEditCommentSubmit(work.id, comment.id)}
                                                                    className="mt-2 bg-blue-600 text-white rounded p-1 hover:bg-blue-500 transition duration-300"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p>{comment.text}</p>
                                                                <button
                                                                    onClick={() => handleEditComment(comment.id, comment.text)}
                                                                    className="text-blue-600 hover:text-blue-500 mr-2"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(work.id, comment.id)}
                                                                    className="text-red-600 hover:text-red-500"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <textarea
                                            value={newComment[work.id] || ''}
                                            onChange={(e) => handleCommentChange(work.id, e.target.value)}
                                            placeholder="Add a comment..."
                                            className="border border-gray-300 rounded p-2 w-full mt-2"
                                        ></textarea>
                                        <button
                                            onClick={() => handleCommentSubmit(work.id)}
                                            className="mt-2 bg-blue-600 text-white rounded p-1 hover:bg-blue-500 transition duration-300"
                                        >
                                            Submit Comment
                                        </button>
                                        {error && <p className="text-red-500 mt-2">{error}</p>}
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
