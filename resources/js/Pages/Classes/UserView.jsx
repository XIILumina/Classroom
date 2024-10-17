import React from 'react';

function UserView({ works }) {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">My Works</h1>
            
            <ul className="list-disc list-inside">
                {works.map((work) => (
                    <li key={work.id}>{work.title} - {work.status}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserView;
