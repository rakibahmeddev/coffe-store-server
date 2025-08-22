const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection UR

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@coffestore.dknjp1m.mongodb.net/?retryWrites=true&w=majority&appName=CoffeStore`;

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
    await client.connect();

    // db info
    const coffeDB = client.db('CoffeDB').collection('Coffes');

    // get coffe
    app.get('/coffe', async (req, res) => {
      const query = coffeDB.find();
      const result = await query.toArray();
      res.send(result);
    });

    // get a single coffe
    app.get('/coffe/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeDB.findOne(query);
      res.send(result);
    });

    // add coffe
    app.post('/addcoffe', async (req, res) => {
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeDB.insertOne(newCoffe);
      res.send(result);
    });

    // update a single coffe
    app.put('/coffe/:id', async (req, res) => {
      const id = req.params.id;
      console.log('id', id);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// routes
app.get('/', (req, res) => {
  res.send('Welcome to the Coffee Store API');
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
