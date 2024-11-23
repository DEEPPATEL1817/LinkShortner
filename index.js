const express = require('express')

const urlRoutes=require('./routes/url')
const { connectToMongoDB }=require('./connect')

const URL = require('./model/url')

const app = express ();
const PORT = 7000;

app.use(express.json())

app.use('/url',urlRoutes);

app.get("/:shortid", async(req,res)=>{
    const shortid= req.params.shortid;
    const entry =await URL.findOneAndUpdate({
        shortid
    },{$push:{
        visitHistory: {
            timestamp:Date.now(),
        }
    }})
    res.redirect(entry.redirectURL);
})

connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(()=>console.log("connect with mongodb successfully "))


app.listen (PORT,()=>console.log(`server is started at port :${PORT}`))