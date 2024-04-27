const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// this is from mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njogpdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    const craftCollection = client.db('craftdb').collection('craft');

    // create post
  app.post('/addCrafts', async(req, res) =>{
    const newCraft =req.body;
    console.log(newCraft)
    // send to mongodb
    const result = await craftCollection.insertOne(newCraft);
    res.send(result)
  })

    // read of crud
  app.get('/myCraftList/:email', async(req, res) =>{
    console.log(req.params.email)
    const cursor = craftCollection.find({email: req.params.email});
    const result = await cursor.toArray();
    res.send(result)
  })

    // get craft info for update my list
  app.get('/singleCraft/:id', async(req, res) =>{
    console.log(req.params.id)
    const cursor = craftCollection.find({_id: new ObjectId(req.params.id)});
    const result = await cursor.toArray();
    res.send(result)
  })

// After getting craft info let's update info of my craft list
app.put('/updateCraft/:id', async(req, res) =>{
  const id = req.params.id;
  console.log(id)
  const query = {_id: new ObjectId(id)};
  const data ={
    $set:{
     
      name:req.body.name,
      subcategory:req.body.subcategory,
      price:req.body.price,
      time:req.body.time,
      rating:req.body.rating,
      description:req.body.description,
      photo:req.body.photo,
    }
  }
  const result = await craftCollection.updateOne(query, data)
  res.send(result)
})

// delete craft from my craft list
app.delete('/deleteMyCraft/:id', async(req, res) =>{
  const id = req.params.id;
  const query ={_id: new ObjectId(id)};
  const result = await craftCollection.deleteOne(query)
  res.send(result)
})

     // get craft item for craft item section
     app.get('/crafts', async(req, res) =>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('my misty mrittika server is running')
})

app.listen(port, () =>{
    console.log(`misty mrittika is running on this port, ${port}`)
})