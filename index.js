const express = require('express');
const app = express();
const cors = require("cors")
require('dotenv').config()
const {MongoClient} = require('mongodb');
const { query } = require('express');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

//middlewars
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&writeConcern=majority`;
const client = new MongoClient(uri);

async function run(){
try{
  await client.connect()
  console.log("database connect successfully")
  const database = client.db('crimson-lite')
  const userCollection = database.collection('users')
  const serviceCollection = database.collection('service')
  const orderCollection = database.collection('order')
  const hotelCollection = database.collection('hotel')
  const hotel_order_Collection = database.collection('hotel_order')
  const contect_collection = database.collection('contect')
  const RattingCollection = database.collection('ratting')
   app.post('/user', async (req, res)=>{
     const body = req.body;
     const users = await userCollection.insertOne(body)
     res.json(users)
   })
   app.get('/user', async (req, res)=>{
     const cursor = userCollection.find({});
     const users = await cursor.toArray();
     res.send(users)
   })
   app.put('/user', async (req, res)=>{
    const user = req.body
    const filter = {email: user.email};
    const options = { upsert: true };
    const updateDoc = {$set: user}
    const result = await userCollection.updateOne(filter, updateDoc, options)
    res.json(result)
   })
   app.get('/service', async (req, res)=>{
     const curser = serviceCollection.find({});
     const service = await curser.toArray();
     res.send(service)
   })
   app.get(`/service/:name`, async(req, res)=>{
     const name = req.params.name;
     const query = {service: name};
     const service = await serviceCollection.findOne(query);
     res.send(service);
   })
   app.get('/service-by-id/:id', async (req, res)=>{
     const id = req.params.id;
    const curser = serviceCollection.find({});
    const service = await curser.toArray();
    const query = service.filter(service => service._id === id);
    res.send(query);
   })
  app.post('/order', async(req, res)=>{
    const body = req.body;
    const order = await orderCollection.insertOne(body);
    res.json(order);
  })
  app.post('/order-hotel', async(req, res)=>{
    const body = req.body;
    const order = await hotel_order_Collection.insertOne(body);
    res.json(order);
  })
  app.get('/order', async (req, res) => {
    const curser = orderCollection.find({});
    const order = await curser.toArray();
    res.send(order);
  })
  app.get('/order/:email', async (req, res) =>{
    const email = req.params.email;
    const curser = orderCollection.find({});
    const order = await curser.toArray();
    const query = order.filter(order => order.email === email);
    res.json(query);
    })
  app.get('/order-hotel', async (req, res) => {
    const curser = hotel_order_Collection.find({});
    const order = await curser.toArray();
    res.send(order);
  })
  app.delete('/order-hotel/:id', async (req, res)=>{
    const id = req.params.id;
    console.log(id)
    const query = {_id : ObjectId(id)};
    const confirm = await hotel_order_Collection.deleteOne(query);
    res.json(confirm);
  })
  app.get('/order-hotel/:email', async (req, res)=>{
    const email = req.params.email;
    const curser = hotel_order_Collection.find({});
    const hotel = await curser.toArray();
    const query = hotel.filter(hotel => hotel.email === email);
    res.send(query)
  })
  app.get('/hotel', async (req, res)=>{
    const curser = hotelCollection.find({});
    const hotel = await curser.toArray();
    res.send(hotel);
  })
  app.get(`/hotel/:country`, async (req, res)=>{
    const country = req.params.country;
    const curser = hotelCollection.find({});
    const hotel = await curser.toArray();
    const query = hotel.filter(hotel => hotel.country === country);
    res.send(query)
  })
  app.get(`/hotel-by-id/:id`, async (req, res)=>{
    const id = req.params.id;
    const query = {_id : ObjectId(id)};
    const service = await hotelCollection.findOne(query)
    res.send(service)
  })
  app.get(`/hotels/:name`, async (req, res)=>{
    const name = req.params.name;
    const curser = hotelCollection.find({});
    const hotel = await curser.toArray();
    const query = hotel.filter(hotel => hotel.name === name);
    console.log(query)
    res.send(query)
  })
  app.post('/contect', async (req, res)=>{
    const body = req.body;
    const contect = await contect_collection.insertOne(body);
    res.json(contect)

  })
  app.get('/contect', async (req, res)=>{
    const curser = contect_collection.find({});
    const contect = await curser.toArray();
    res.send(contect)
  })
  app.get('/user/:email', async (req, res)=>{
    const email = req.params.email;
    const query = {email : email};
    const user = await userCollection.findOne(query);
    res.send(user)
  })
  app.post('/ratting', async (req, res)=>{
    const body = req.body;
    const ratting = await RattingCollection.insertOne(body);
    res.json(ratting)
  })
  app.get('/ratting', async (req, res) =>{
    const curser = RattingCollection.find({});
    const rating = await curser.toArray();
    res.send(rating)
  })
  app.get('/ratting/showing', async (req, res) =>{
   const curser = RattingCollection.find({});
   const rating = await curser.toArray();
   const query = rating.filter(rate => rate.show === "show");
   res.send(query)
  })
  app.put('/ratting', async (req, res) =>{
    const body = req.body;
    console.log(body)
    const filter = {_id : ObjectId(body._id)};
    const updateDoc = {
      $set: {
        show : body.show
      },
    };
    const result = await RattingCollection.updateOne(filter, updateDoc);
    res.json(result)
  })
}

finally{
  // await client.close();
}
}

run().catch(console.dir)
app.get('/',(req, res)=>{
  res.send('crimson travel server running this port')
})
app.listen(port, () => {
  console.log (`server running ${port}`)
})