'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import TaskCard from '@/components/TaskCard';

export default function LandingTasks() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        api.get('/tasks')
            .then(res => setTasks(res.data.slice(0, 3)))
            .catch(err => console.log(err));
    }, []);

    if (tasks.length === 0) {
        return <p className="text-gray-500">No tasks yet. Create your first task!</p>;
    }

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {tasks.map(task => (
                <TaskCard key={task._id} task={task} />
            ))}
        </div>
    );
}
