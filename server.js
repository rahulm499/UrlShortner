const express = require('express');
require('./mongoose');
const ShortUrl = require('./models/shorturl');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));




//Setting up templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find();
    res.render('index',{shortUrls: shortUrls});
})

app.post('/shortUrls', async (req, res)=>{
    await ShortUrl.create({full: req.body.fullUrl});
    res.redirect('/');
})

app.get('/:shortUrl', async (req, res)=>{
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl});
    if(shortUrl == null){
        return res.sendStatus(404);
    }else{
        shortUrl.clicks++;
        shortUrl.save();

        res.redirect(shortUrl.full);
    }
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`App is Listening on Port ${port}`);
})