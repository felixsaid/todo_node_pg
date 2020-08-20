const express = require("express");
const app = express();
const pool = require("./db");
const stts = require("./helpers/status");

app.use(express.json()); // => req.body

//ROUTES//

//get all todo

app.get("/v1/api/todos", async (req, res) => {
  try {
    const all_todos = await pool.query("SELECT * FROM todo");

    const res_todos = all_todos.rows;

    stts.successMessage.data = res_todos;

    return res.status(stts.status.success).send(stts.successMessage);
  } catch (err) {
    console.error(err.message);
  }
});

//get todo by id

app.get("/v1/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo_by_id = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1",
      [id]
    );

    const res_todos_id = todo_by_id.rows[0];

    if (res_todos_id == undefined) {
      stts.errorMessage = "Todo with id " + id + " was not found";
      return res.status(stts.status.notfound).send(stts.errorMessage);
    } else {
      stts.successMessage.data = res_todos_id;

      return res.status(stts.status.success).send(stts.successMessage);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//create a todo

app.post("/v1/api/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );

    const db_response = newTodo.rows[0];

    stts.successMessage.data = db_response;
    return res.status(stts.status.created).send(stts.successMessage);

    //res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/v1/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const update_todo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
      [description, id]
    );

    const db_response = update_todo.rows[0];

    stts.successMessage.data = db_response;
    return res.status(stts.status.success).send(stts.successMessage);
  } catch (err) {
    console.log(err.message);
  }
});

//delete a todo

app.delete("/v1/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const delete_todo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1",
      [id]
    );

    res.json("Todo was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("server is listening to port 5000");
});
