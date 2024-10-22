import React from 'react';

function TeacherView({ classes, works, onAddClass, onRateWork }) {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Teacher Panel</h1>
            
            <h2 className="text-xl mb-2">My Classes</h2>
            <ul className="list-disc list-inside">
                {classes.map((classItem) => (
                    <li key={classItem.id}>{classItem.name}</li>
                ))}
            </ul>
            <button 
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={onAddClass}
            >
                Add Class
            </button>
            
            <h2 className="text-xl mt-4 mb-2">Pending Works</h2>
            <ul className="list-disc list-inside">
                {works.map((work) => (
                    <li key={work.id}>
                        {work.title}
                        <button 
                            className="ml-2 text-blue-500 hover:underline"
                            onClick={() => onRateWork(work)}
                        >
                            Rate Work
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TeacherView;
