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

var Top = mongoose.model('top', topSchema);
mongoose.Promise = global.Promise;
mongoose.connect(urlmongo);

async function Scrape(){
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://2ch.hk/b/');
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
     Top.count({}).exec() 
  .then((count)=>{
    countOfItems = count; 

    // first insertion
    if (countOfItems == 0) {
         var newTop = new Top(res);
        newTop.save()
        // clear arrays for memory safety
        res = []
    }
    // updating 
    else {  
       if (countOfItems > 15){
          var delta = countOfItems - 10;
          for (let i=0; i<delta; i++){
            Top.find().exec()
             .then((result)=>{
                Top.find({title: result[i].title}).remove().exec();
              })
         }                
       }
       for (let i=0; i<res.length; i++){
          if (res[i].title !== undefined){
            
            // if value not exists in database, insert it   
            Top.findOneAndUpdate({title: res[i].title}, res[i], { upsert: true }).exec()
            .then(()=>{
              // clear arrays for memory safety
              res = []
            })
          }
       }
        
    }})
        .catch((err)=>reject(err))
  

  await browser.close();
};

setInterval(Scrape, 15000)

app.get('/top', function(req, res, next) {

  Top.find().exec()
   .then((result)=>{
      result = JSON.stringify(result.slice(0, 16));
      res.json(result);
    })
   .catch((err)=>console.log(err))

                          
});

app.listen(process.env.PORT || 8081).timeout=150000;