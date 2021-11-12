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

         


        //user collection
        const usersCollection = database.collection('users');

        //order place
        const ordersCollection = database.collection('orders');

        // reviews
        const reviewsCollection = database.collection('reviews');

        // product
        const homeProductsCollection = database.collection('homeProducts')

// products load
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
// single product load
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

//Delete api product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })





// admin verified
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

    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
  })
  


// admin
        app.put('/users/admin', async(req, res) => {
            const user = req.body;
            // const requester = req.decodeEmail;
            // if(requester){
            //     const requesterAccount = await usersCollection.findOne({email: requester});
            //     if(requesterAccount.role === 'admin'){
                    const filter = { email: user.email};
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
            //     }
            // }

            // else{
            //     res.status(403).json({ message: 'you do not have access to make admin' })
            // }
        })







// reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
            })

        

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
            
        });



// order 
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })



        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);

        });

//Delete api order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

// UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedOrder.name,
                   
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.json(result)

        })



// product 
        app.get('/homeProducts', async (req, res) => {
            const cursor = homeProductsCollection.find({});
            const homeProducts = await cursor.toArray();
            res.send(homeProducts);
        })



        app.post('/homeProducts', async (req, res) => {
            const homeProduct = req.body;
            const result = await homeProductsCollection.insertOne(homeProduct);
            res.json(result);

        });

        app.get('/homeProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const homeProduct = await homeProductsCollection.findOne(query);
            res.json(homeProduct);
        })
            



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







