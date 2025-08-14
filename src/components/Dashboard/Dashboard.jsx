

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Header from "./Header"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import TaskFilters from "./TaskFilters"
import TaskStats from "./TaskStats"
import api from "../../services/api"

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks")
      setTasks(response.data.tasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData)
      setTasks([response.data.task, ...tasks])
      setShowTaskForm(false)
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData)
      setTasks(tasks.map((task) => (task.id === taskId ? response.data.task : task)))
      setEditingTask(null)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId)
      const response = await api.put(`/tasks/${taskId}`, {
        ...task,
        completed: !task.completed,
      })
      setTasks(tasks.map((t) => (t.id === taskId ? response.data.task : t)))
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "all") {
      if (filters.status === "completed" && !task.completed) return false
      if (filters.status === "incomplete" && task.completed) return false
    }

    if (filters.priority !== "all" && task.priority !== filters.priority) {
      return false
    }

    if (filters.category !== "all" && task.category !== filters.category) {
      return false
    }

    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your tasks and stay productive</p>
        </div>

        <TaskStats tasks={tasks} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TaskFilters filters={filters} setFilters={setFilters} tasks={tasks} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Tasks ({filteredTasks.length})</h2>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Task
                  </button>
                </div>
              </div>

              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </div>
        </div>
      </div>

      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
          onClose={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
