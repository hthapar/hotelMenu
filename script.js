const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const port = 4000;

app.use("/css",express.static(__dirname + '/public/css'));
// console.log(__dirname + '/public/css')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

var dbObject;

MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db) => {
        if (err) throw err;
        dbObject = db.db("dbUsers");
    }
);

//showing the html page on entering the url
app.get("/", (_req, res) => {
    res.sendFile("/Users/htq5942/Documents/node-js/hotelMenu/index.html");
});

//validator function
    app.post('/valid-user-hotel-menu',(req,res) =>{
        dbObject.collection("users")
        .find()
        .toArray((err, result)=>{
            if (err) throw err;

        var uName = result[0].user;
        var uPass = result[0].password;
        if(req.body.uname === uName && req.body.pass === uPass){
            console.log('User Validated');
            res.sendFile("/Users/htq5942/Documents/node-js/hotelMenu/menu.html");
        }
        else{
            console.log('User Not Valid');
            // alert('Invalid Username or password!');
            res.redirect("/");
        }
    });
});

app.get("/menu", (_req, res) => {
    dbObject.collection("menu")
        .find()
        .toArray((err, result) => {
            if (err) throw err;
            console.log('result printed on UI')
            // console.log(result)
            res.send(result);
        });
});

app.get("/fetch-data", (req, res) => {
    dbObject.collection("menu")
        .find({id:"req.body.fetch_btn"})
        .toArray((err, result) => {
            if (err) throw err;
            console.log('getting data from id & printing on UI');
            // console.log(req.body.fetch_btn)
            console.log(result);
            res.send(result);
        });
});


app.post("/add-data", (req, res) => {
    dbObject.collection("menu")
    .insertOne(
        {
            id:Number(req.body.pid),
            name:req.body.dish_name,
            image:req.body.dish_image,
            price:Number(req.body.dish_cost)
        }
    )
    console.log('data inserted: 1 row added')
    res.redirect('/displaytable');
        
});

app.get('/displaytable',(_req,res)=>{
    res.sendFile("/Users/htq5942/Documents/node-js/hotelMenu/menu.html");
})

app.listen(port, () => console.log(`Listening on port ${port}!`));