
import { useState } from "react"

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

const categoryColors = {
  Work: "bg-blue-100 text-blue-800",
  Personal: "bg-purple-100 text-purple-800",
  Shopping: "bg-pink-100 text-pink-800",
  Health: "bg-green-100 text-green-800",
  Education: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dateString) => {
    if (!dateString) return false
    const dueDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today && !task.completed
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id)
    }
  }

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${task.completed ? "opacity-60" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </h3>

              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>

                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}
                >
                  {task.category}
                </span>

                {task.due_date && (
                  <span
                    className={`text-xs ${isOverdue(task.due_date) ? "text-red-600 font-medium" : "text-gray-500"}`}
                  >
                    Due: {formatDate(task.due_date)}
                    {isOverdue(task.due_date) && " (Overdue)"}
                  </span>
                )}
              </div>
            </div>

            {showActions && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(task)}
                  className="text-gray-400 hover:text-blue-600 focus:outline-none"
                  title="Edit task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-600 focus:outline-none"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
