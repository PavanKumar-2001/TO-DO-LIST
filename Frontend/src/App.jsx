import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css';
import Sidebar from './Sidebar';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("work");
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filter, setFilter] = useState({ status: "all", category: "all" });

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
      updateCounts(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const updateCounts = (tasks) => {
    const completed = tasks.filter((task) => task.completed === 1).length;
    const pending = tasks.length - completed;
    setCompletedCount(completed);
    setPendingCount(pending);
  };

  const addTask = async () => {
    if (!taskName.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/tasks", {
        task_name: taskName,
        category,
        completed: 0,
      });
      setTaskName("");
      setCategory("work");
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/complete/${id}`, {
        completed: completed ? 0 : 1,
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTaskName(task.task_name);
    setCategory(task.category);
  };

  const updateTask = async () => {
    if (!taskName.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editingTask.id}`, {
        task_name: taskName,
        category,
        completed: editingTask.completed,
      });
      setTaskName("");
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleFilterChange = (status, category) => {
    setFilter({ status, category });
    setShowSidebar(true); 
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filter.status === "all" || 
      (filter.status === "pending" && task.completed === 0) || 
      (filter.status === "completed" && task.completed === 1);
    const categoryMatch = filter.category === "all" || task.category === filter.category;
    return statusMatch && categoryMatch;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="main-container">
      <button className="sidebar-toggle" onClick={() => setShowSidebar(true)}>
        ☰
      </button>
      {showSidebar && (
        <Sidebar
          onFilterChange={handleFilterChange}
          onClose={() => setShowSidebar(false)}
        />
      )}
      <h1>To-Do List</h1>
      <div className="enter-task">
        <input
          type="text"
          placeholder="Enter tasks..........."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        {editingTask ? (
          <button className="update-btn" onClick={updateTask}>Update Task</button>
        ) : (
          <button className="add-btn" onClick={addTask}>Add Task</button>
        )}
      </div>
      <div className="categories">
        <label>
          <input
            type="radio"
            name="category"
            value="work"
            checked={category === "work"}
            onChange={() => setCategory("work")}
          />
          Work
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="personal"
            checked={category === "personal"}
            onChange={() => setCategory("personal")}
          />
          Personal
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="urgent"
            checked={category === "urgent"}
            onChange={() => setCategory("urgent")}
          />
          Urgent
        </label>
      </div>
      <div className="tasks">
        {filteredTasks.map((task) => (
          <div key={task.id} className="subtasks">
            <span style={{ textDecoration: task.completed === 1 ? "line-through" : "none" }}>
              {task.task_name} ({task.category})
            </span>
            <input
              type="checkbox"
              checked={task.completed === 1}
              onChange={() => toggleComplete(task.id, task.completed)}
            />
            <button className="edit-btn" onClick={() => editTask(task)}>Edit</button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="show">
        <p id="c">Completed: {completedCount}</p>
        <p id="p">Pending: {pendingCount}</p>
      </div>
    </div>
  );
};

export default App;