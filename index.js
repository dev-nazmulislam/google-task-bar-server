const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config(); // import env file if use environment variables after install || npm install dotenv --save|| ane Create a .env file in the root of your project:

const port = process.env.PORT || 5000;
const app = express();

// used Middleware
app.use(cors());
app.use(express.json());

// Connact With MongoDb Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evqdz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Create a async fucntion to all others activity
async function run() {
  try {
    await client.connect();

    // Create Database to store Data
    const todoCollection = client.db("todo-list").collection("todos");

    app.get("/todos", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    });
    app.post("/todos", async (req, res) => {
      const todoList = req.body;
      const result = await todoCollection.insertOne(todoList);
      res.send(result);
    });
    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const result = await todoCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.put("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const newTask = req.body;

      const result = await todoCollection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            _id: ObjectId(id),
            todoName: newTask.todoName,
            addItem: newTask.addItem,
            todos: newTask.todos,
          },
        },
        { upsert: true }
      );
      res.send({ result });
    });
  } finally {
    // await client.close();
  }
}

// Call the fuction you decleare abobe
run().catch(console.dir);

// Root Api to cheack activity
app.get("/", (req, res) => {
  res.send("Hello From Todo list!");
});

app.listen(port, () => {
  console.log(`Todo List listening on port ${port}`);
});
