const shortid = require('shortid')
const  URL = require('../model/url')

async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"url is required"})
    const shortID = shortid();

    await URL.create({
        shortid:shortID,
        redirectURL:body.url,
        visitHistory:[]
    })
    res.render("home", {
        id: shortID,
    });
}

async function handleAnalytics(req,res) {
    const shortid=req.params.shortid;
    const result= await URL.findOne({shortid})
    return res.json({totalClicks:result.visitHistory.length , analytics:result.visitHistory})
}

module.exports={handleGenerateNewShortURL , handleAnalytics}
