import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function ClassA() {
    return (
        <AuthenticatedLayout>
        <div>
            <h1>Class A</h1>
            <p>Here you'll see tasks and questions for Class A.</p>
        </div>
        </AuthenticatedLayout>
    );
}

export default ClassA;
