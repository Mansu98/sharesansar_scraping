var cron = require('node-cron');

cron.schedule('5 6,18 * * *', () => {

var MongoClient = require('mongodb').MongoClient;

// Import required module csvtojson and mongodb packages
const csvtojson = require('csvtojson');
const mongodb = require('mongodb');

var url = "mongodb+srv://mernuser:user1@mernproject.iccbl.mongodb.net/Morntea?retryWrites=true&w=majority";
let collectionName;

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Morntea");
    dbo.listCollections().toArray(function (err, collectionInfos) {
    collectionName = collectionInfos[1].name;
        console.log(collectionName);
        const fileName = 'detailNews.csv';
var arrayToInsert = [];
csvtojson().fromFile(fileName).then(source => {
    // Fetching the all data from each row
    for (var i = 0; i < source.length; i++) {
         var oneRow = {
             title: source[i]['title'],
             date: source[i]['date'],
             image: source[i]['image'],
             content: source[i]['content']
         };
         arrayToInsert.push(oneRow);
     }
    
     var collection = dbConn.collection(collectionName);
     collection.insertMany(arrayToInsert, (err, result) => {
         if (err) console.log(err);
         if(result){
             console.log('Import CSV into database successfully.');
         }
     });
});

        db.close();
    });
});


var dbConn;

mongodb.MongoClient.connect(url, {
  
}).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
}).catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

}); //scheduled
