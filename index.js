//Importing 
const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

//Initializing
const app = express();
const port = 3000;

//Middleware
app.use(express.json());

//Listening request on port 3000
app.listen(port, ()=>{
    console.log('Node.js Running on Port', port);
});

//connection to Server
const urlstring = "mongodb://localhost:27017";
const client = new MongoClient(urlstring);
const dbname = "crud1";
let db;

async function CTMongo(){
    try{
        await client.connect();
        db = client.db(dbname);
        console.log("connected to MongoDB");
    } catch(err){
        console.error("Error While Connecting to Database", err);
    }
}

CTMongo();

app.post('/apis', async (req, res)=>{
    try{
        const result = await db.collection('movies').insertOne(req.body);
        res.status(201).json(result);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to Insert a Document"});
    }
});

app.get('/apis', async (req, res)=>{
    try{
        const result = await db.collection('movies').find().toArray();
        res.json(result);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to Rearch Movie"});
    }
});



app.get('/apis/:id', async (req, res)=>{
    try{
        const result = await db.collection('movies').findOne(
            { _id: new ObjectId(req.params.id)});
        if(!result){
            return res.status(404).json({message: "Movie Not Fount"});
        }
        res.json(result);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to Rearch Movie"});
    }
});

app.put('/apis/:id', async (req, res)=>{
    try{
        const result = await db.collection('movies').updateOne(
            {_id: new ObjectId(req.params.id)},
            {$set: req.body}
        );
        if(result.MatchedCount === 0){
            res.status(404).json({message: "Movie not Found"});
        }
        res.json({message: "Movie Details Updated"});
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to Update Movie"});
    }
});

app.delete('/apis/:id', async (req, res)=>{
    try{
        const result = await db.collection('movies').deleteOne(
            { _id: new ObjectId(req.params.id)});
        if(result.deletedCount === 0){
            res.status(404).json({message: "Movie not Found"});
        }
        res.json({message: "Movie Deleted Successfully"});
    } catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to Delete Movie"});
    }
});




