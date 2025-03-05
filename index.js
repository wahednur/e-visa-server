require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dbUser = process.env.MDB_USER;
const dbPass = process.env.MDB_PASS;
// App declare
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  optionSuccessStatus: 200,
};
//Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`<h1>E.VISA Server is running on ${port} Port</h1>`);
});

//MongoDB start

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.um8n1zy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    //Database collections
    const userCollection = client.db("evisa").collection("users");
    const visaCollection = client.db("evisa").collection("visas");

    // Mongodb Operation start
    app.post("/create-user", async (req, res) => {
      const newUser = req.body;
      const existingUser = await userCollection.findOne({
        email: newUser.email,
      });
      if (existingUser) {
        res.send({ message: "User already exist, login successful" });
      } else {
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // Add a visa

    app.post("/add-visa", async (req, res) => {
      const newVisa = req.body;
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    });

    //Get all  visa
    app.get("/visas", async (req, res) => {
      const result = await visaCollection.find().toArray();
      res.send(result);
    });

    app.get("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    // Mongodb Operation end

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//MongoDB end

app.listen(port, () => {
  console.log(`E.VISA Server is running on ${port} Port`);
});
