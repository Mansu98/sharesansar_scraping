var cron = require('node-cron');

cron.schedule('0 6,18 * * *', () => {

const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;


const news = "https://www.sharesansar.com/";

var newsData =[];
(async()=>{
    const response = await request({
        uri:news,
        headers:{
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9"
        },
        gzip:true
    });
    let $ = cheerio.load(response);
    $('div.col-lg-9.col-md-9.col-sm-8.col-xs-12.sp-fix > div > div.col-md-7 > div > ul > li').each((i,element)=>
    {

        const title =$(element).find('a').text().trim();
        const link =$(element).find('a').attr('href').trim();   

    newsData.push({
      title,
      link
    });

    (async()=>{
        let detailData =[]; 
        let links=[]; 
    
        newsData.map((item,i)=>{
            links.push(newsData[i].link);
            })
     
            for(let link of links)
            {    
      const response = await request({
            uri:link, 
              headers:{
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip:true
        });
        let $ = cheerio.load(response);
        let title= $("div > div > div.col-md-12 > h2").text().trim();
        let date = $('div.col-md-12 > div.margin-bottom-10 > div.col-lg-8 > h5').text().trim();
        let img = $('div > div > div > div.col-md-12 > figure > img').attr('src');
        let detail =$('#newsdetail-content').text().trim();
        
      
        detailData.push({
            title:title,
            date: date,
            image: img,
            content: detail
           
        });
            }

            const json2 = new json2csv();
const csv1 = json2.parse(detailData);
fs.writeFileSync("./detailNews.csv", csv1, "utf-8")
})();

})
   
const j2cp = new json2csv();
const csv = j2cp.parse(newsData);
fs.writeFileSync("./news.csv", csv, "utf-8")
})
();
console.log("scraping done ..." );


});



