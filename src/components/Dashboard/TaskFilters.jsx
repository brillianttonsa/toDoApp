
const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Education", "Other"]

export default function TaskFilters({ filters, setFilters, tasks }) {
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  const getTaskCount = (filterType, filterValue) => {
    return tasks.filter((task) => {
      switch (filterType) {
        case "status":
          if (filterValue === "completed") return task.completed
          if (filterValue === "incomplete") return !task.completed
          return true
        case "priority":
          return filterValue === "all" || task.priority === filterValue
        case "category":
          return filterValue === "all" || task.category === filterValue
        default:
          return true
      }
    }).length
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search by title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            {[
              { value: "all", label: "All Tasks" },
              { value: "incomplete", label: "Incomplete" },
              { value: "completed", label: "Completed" },
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={filters.status === option.value}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {option.label} ({getTaskCount("status", option.value)})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities ({getTaskCount("priority", "all")})</option>
            <option value="high">High ({getTaskCount("priority", "high")})</option>
            <option value="medium">Medium ({getTaskCount("priority", "medium")})</option>
            <option value="low">Low ({getTaskCount("priority", "low")})</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories ({getTaskCount("category", "all")})</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category} ({getTaskCount("category", category)})
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() =>
            setFilters({
              status: "all",
              priority: "all",
              category: "all",
              search: "",
            })
          }
          className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
