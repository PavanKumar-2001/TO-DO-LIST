const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  user: "system",
  password: "laku",
  connectString: "127.0.0.1:1522/XE",
};

app.post("/api/tasks", async (req, res) => {
  const { task_name, category } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `INSERT INTO tasks (task_name, category, completed) VALUES (:task_name, :category, 0)`;
    await connection.execute(sql, [task_name, category], { autoCommit: true });
    res.status(201).json({ message: "Task added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add task" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.get("/api/tasks", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `SELECT id, task_name, category, NVL(completed, 0) as completed FROM tasks`;
    const result = await connection.execute(sql);

    const tasks = result.rows.map((row) => ({
      id: row[0],
      task_name: row[1],
      category: row[2],
      completed: row[3],
    }));

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { task_name, category } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `UPDATE tasks SET task_name = :task_name, category = :category WHERE id = :id`;
    await connection.execute(sql, [task_name, category, id], { autoCommit: true });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.put("/api/tasks/complete/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `UPDATE tasks SET completed = :completed WHERE id = :id`;
    await connection.execute(sql, [completed, id], { autoCommit: true });
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task status" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `DELETE FROM tasks WHERE id = :id`;
    await connection.execute(sql, [id], { autoCommit: true });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});