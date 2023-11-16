const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvn4ffv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("bistroBossDB").collection("users");
    const menuCollection = client.db("bistroBossDB").collection("menus");
    const reviewCollection = client.db("bistroBossDB").collection("reviews");
    const cartCollection = client.db("bistroBossDB").collection("carts");

    // user related api
    app.post('/user', async(req, res) => {
        const user = req.body;
        // checking user
        const query = {email: user.email};
        const existingUser = await userCollection.findOne(query);
        if(existingUser){
          res.send({message: 'user already exist', insertedId: null})
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/menu', async(req, res) =>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    app.get('/reviews', async(req, res) =>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })
    // carts
    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })
    app.post('/carts', async(req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })
    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('final project')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})