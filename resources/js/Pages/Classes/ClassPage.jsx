import React from 'react';

export default function ClassPage({ classDetails, quests }) {
    const [newQuest, setNewQuest] = useState('');

    const handleCreateQuest = (e) => {
        e.preventDefault();
        // Post quest creation to backend (using Inertia or axios)
        console.log('Quest Created:', newQuest);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{classDetails.name}</h1>
            <h2 className="text-lg mb-4">Quests</h2>
            <ul className="list-disc list-inside mb-6">
                {quests.map((quest) => (
                    <li key={quest.id}>{quest.title}</li>
                ))}
            </ul>

            <form onSubmit={handleCreateQuest}>
                <input
                    type="text"
                    value={newQuest}
                    onChange={(e) => setNewQuest(e.target.value)}
                    placeholder="New Quest Title"
                    className="border p-2 rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Create Quest
                </button>
            </form>
        </div>
    );
}
