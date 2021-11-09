const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoj9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
         await client.connect();
        console.log('database connected successfully')

        const database = client.db('Perfume_Pride');
        const productsCollection = database.collection('products');

        //user collection
        const usersCollection = database.collection('users');

    }







    finally{
        // await client.close()
    }
}










app.get('/', (req, res) => {
    res.send('Hello Niche website')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})