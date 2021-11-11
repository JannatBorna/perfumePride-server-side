const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoj9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to database')
        const database = client.db('perfumePride');
        const productsCollection = database.collection('products')

        // //user collection
        const usersCollection = database.collection('users');

        // reviews
        const reviewsCollection = database.collection('reviews');

// GET API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
// GET SINGLE PRODUCT
        app.get('/products/:id', async (req, res) =>{
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.json(product);
        })


//POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('Hit the post api', product);
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });


// user get
  app.get('/users/:email', async(req, res) =>{
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
          isAdmin = true;
      }
    res.json({admin: isAdmin});
  })

// user post
  app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
  })


// reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
            })

        // user post
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await usersCollection.insertOne(review);
            res.json(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            // console.log('Hit the post api', review);
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
            
        });

    }







    finally{
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Niche website')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})







