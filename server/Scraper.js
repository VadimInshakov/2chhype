const puppeteer = require('puppeteer');
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

app.use(cors({

  origin: ['https://still-cove-13917.herokuapp.com'],
  allowedHeaders: '*'

}));

var urlmongo = process.env.HYPE_MONGOLAB_URI;
var Schema = mongoose.Schema;

var topSchema = new Schema({
    title: String,
    link: String,
});

var Topb = mongoose.model('topb', topSchema);
var Toppo = mongoose.model('toppo', topSchema);
var Toppr = mongoose.model('toppr', topSchema);
var Topnews = mongoose.model('topnews', topSchema);
var Topvg = mongoose.model('topvg', topSchema);
var Topa = mongoose.model('topa', topSchema);
mongoose.Promise = global.Promise;
mongoose.connect(urlmongo);

async function Scrape(top, board){
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://2ch.hk/' + board + '/');
  await page.waitForSelector('.boardstats-row');
  // Extract the results from the page
var res = await page.evaluate((allResultsSelector) => {
    var arr = [];
    const anchors = document.querySelectorAll(allResultsSelector);
    anchors.forEach((v, i)=>{
      arr.push({title: v.childNodes[0].textContent,
                link: v.childNodes[0].childNodes[0].href
              })
    })
    return arr;
    }, 'div[class="boardstats-row"]')
    
   arr = [];
  //load to MongoDB
  var countOf
     top.count({}).exec() 
  .then((count)=>{
    countOfItems = count; 

    // first insertion
    if (countOfItems == 0) {
         var newTop = new top(res);
        newTop.save()
        // clear arrays for memory safety
        res = []
    }
    // updating 
    else {  
       if (countOfItems > 15){
          var delta = countOfItems - 10;
          for (let i=0; i<delta; i++){
            top.find().exec()
             .then((result)=>{
                top.find({title: result[i].title}).remove().exec();
              })
         }                
       }
       for (let i=0; i<res.length; i++){
          if (res[i].title !== undefined){
            
            // if value not exists in database, insert it   
            top.findOneAndUpdate({title: res[i].title}, res[i], { upsert: true }).exec()
            .then(()=>{
              // clear arrays for memory safety
              res = []
            })
          }
       }
        
    }})
        .catch((err)=>reject(err))
  

  await browser.close();
  return 0;
};

async function Starter(){
   await Scrape(Topb, 'b');
   await Scrape(Toppo, 'po');
   await Scrape(Topnews, 'news');
   await Scrape(Toppr, 'pr');
   await Scrape(Topvg, 'vg');
   await Scrape(Topa, 'a');
}

setInterval(Starter, 15000);

app.get('/topb', function(req, res, next) {

  Topb.find().exec()
   .then((result)=>{
      resultb = JSON.stringify(result.slice(0, 10));
      res.json(resultb);
    })
   .catch((err)=>console.log(err))                          
});

app.get('/toppo', function(req, res, next) {

  Toppo.find().exec()
   .then((result)=>{
      resultpo = JSON.stringify(result.slice(0, 10));
      res.json(resultpo);
    })
   .catch((err)=>console.log(err))                    
});

app.get('/toppr', function(req, res, next) {

  Toppr.find().exec()
   .then((result)=>{
      resultpr = JSON.stringify(result.slice(0, 10));
      res.json(resultpr);
    })
   .catch((err)=>console.log(err))                    
});

app.get('/topnews', function(req, res, next) {

  Topnews.find().exec()
   .then((result)=>{
      resultnews = JSON.stringify(result.slice(0, 10));
      res.json(resultnews);
    })
   .catch((err)=>console.log(err))                    
});

app.get('/topvg', function(req, res, next) {

  Topvg.find().exec()
   .then((result)=>{
      resultvg = JSON.stringify(result.slice(0, 10));
      res.json(resultvg);
    })
   .catch((err)=>console.log(err))                    
});

app.get('/topa', function(req, res, next) {

  Topa.find().exec()
   .then((result)=>{
      resulta = JSON.stringify(result.slice(0, 10));
      res.json(resulta);
    })
   .catch((err)=>console.log(err))                    
});

app.listen(process.env.PORT || 8081).timeout=150000;