import React, { useState, useMemo, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./App.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAddTask = useCallback(() => {
    const sanitizedTask = task.trim();

    if (sanitizedTask && sanitizedTask.length <= 100) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), text: sanitizedTask },
      ]);
      setTask("");
      setError("");
      setFeedback("Task added successfully!");
    } else {
      setError("Please enter a valid task (1-100 characters).");
      setFeedback("");
    }
  }, [task]);

  const handleCompleteTask = useCallback((taskToComplete) => {
    setTasks((prevTasks) =>
      prevTasks.filter((t) => t.id !== taskToComplete.id)
    );
    setCompletedTasks((prevCompletedTasks) => [
      ...prevCompletedTasks,
      taskToComplete,
    ]);
    setFeedback("Task marked as completed.");
  }, []);

  const handleDeleteTask = useCallback((taskToDelete) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskToDelete.id));
    setFeedback("Task deleted.");
  }, []);

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const taskStats = useMemo(
    () => ({
      labels: ["Pending", "Completed"],
      datasets: [
        {
          data: [tasks.length, completedTasks.length],
          backgroundColor: ["#FF6384", "#36A2EB"],
          hoverOffset: 4,
        },
      ],
    }),
    [tasks, completedTasks]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Tracker</h1>
      </header>
      <main>
        <div className="task-input">
          <input
            type="text"
            placeholder="Enter task details"
            value={task}
            onChange={handleTaskChange}
            aria-label="Task input"
          />
          <button onClick={handleAddTask}>Add Task</button>
          {error && <p className="error-message">{error}</p>}
          {feedback && <p className="feedback-message">{feedback}</p>}
        </div>
        <div className="task-list">
          <h2>Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.text}
                <button
                  onClick={() => handleCompleteTask(task)}
                  aria-label={`Complete ${task.text}`}
                >
                  Complete
                </button>
                <button
                  onClick={() => handleDeleteTask(task)}
                  aria-label={`Delete ${task.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="completed-task-list">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((task) => (
              <li key={task.id}>{task.text}</li>
            ))}
          </ul>
        </div>
        <div className="task-progress">
          <h2>Task Progress</h2>
          <div className="chart-container">
            <Pie data={taskStats} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
