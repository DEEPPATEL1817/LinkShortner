const express = require('express')
const path = require ("path")

const urlRoutes=require('./routes/url')
const { connectToMongoDB }=require('./connect')
const staticRouter = require ("./routes/staticRouter")

const URL = require('./model/url')

const app = express ();
const PORT = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/url',urlRoutes);
app.use('/',staticRouter)

app.set("view engine","ejs");
app.set("views", path.resolve("./views"))

//this is server side rendering
// app.get("/test",async (req,res)=>{
//     const allurls = await URL.find({});
//      return res.render('home',{
//         urls:allurls,
//      })
// })

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