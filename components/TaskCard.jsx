import React from 'react';
import { Calendar, Edit, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const statusColors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
    };

    const statusIcons = {
        'pending': Circle,
        'in-progress': Clock,
        'completed': CheckCircle,
    };

    const StatusIcon = statusIcons[task.status] || Circle;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className={clsx(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                        statusColors[task.status]
                    )}>
                        <StatusIcon size={12} />
                        {task.status.replace('-', ' ')}
                    </span>
                    {task.dueDate && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

            <div className="flex justify-end">
                {task.status !== 'completed' && (
                    <button
                        onClick={() => onStatusChange(task._id, 'completed')}
                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                    >
                        <CheckCircle size={16} />
                        Mark Complete
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
