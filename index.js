// const express = require('express')
// const path = require ("path")

// const urlRoutes=require('./routes/url')
// const { connectToMongoDB }=require('./connect')
// const staticRouter = require ("./routes/staticRouter")

// const URL = require('./models/url')

// const app = express ();
// const PORT = 8000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));



// app.use('/url',urlRoutes);
// app.use('/',staticRouter)

// app.set("view engine","ejs");
// app.set("views", path.resolve("./views"))

// //this is server side rendering
// // app.get("/test",async (req,res)=>{
// //     const allurls = await URL.find({});
// //      return res.render('home',{
// //         urls:allurls,
// //      })
// // })

// app.get("/url/:shortId", async(req,res)=>{
//     const shortId= req.params.shortId;
//     const entry =await URL.findOneAndUpdate({
//         shortId
//     },
//     {
//         $push:{
//         visitHistory: {
//             timestamp:Date.now(),
//         }
//     }})
//     res.redirect(entry.redirectURL);
// })

// connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(()=>console.log("connect with mongodb successfully "))


// app.listen (PORT,()=>console.log(`server is started at port :${PORT}`))



const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

connectToMongoDB(process.env.MONGODB ?? "mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));