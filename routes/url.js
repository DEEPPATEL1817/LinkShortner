const express = require('express')
const {handleGenerateNewShortURL , handleAnalytics}= require("../controller/url")

const router = express.Router();

router.post('/',handleGenerateNewShortURL);

router.get('/analytics/:shortid',handleAnalytics )

module.exports=router;