import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from 'react-router-dom';

function ClassList() {
    const classes = ['Class A', 'Class B', 'Class C'];

    return (
        <AuthenticatedLayout>
        <div>
            <h1>Available Classes</h1>
            <ul>
                {classes.map((className, index) => (
                    <li key={index}>
                        <Link to={`/class/${className}`}>{className}</Link>
                    </li>
                ))}
            </ul>
        </div>
        </AuthenticatedLayout>
    );
}

export default ClassList;
