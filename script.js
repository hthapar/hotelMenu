const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
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
            // console.log('User Validated');
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
            // console.log('result printed on UI')
            // console.log(result)
            res.send(result);
        });
});

app.get("/fetch-data/:pid", (req, res) => {
    
    dbObject.collection("menu")
        .find({"id":Number(req.params.pid)})
        .toArray((err, result) => {
            if (err) throw err;
            // console.log('getting data from id & printing on UI');
            res.send(result);
        });
});


// app.post("/new-table-data", (req, res) => {
//     dbObject.collection("menu")
//     .insertOne(
//         {
//             id:Number(req.body.pid),
//             name:req.body.dish_name,
//             image:req.body.dish_image,
//             price:Number(req.body.dish_cost)
//         }
//     )
//     console.log('data inserted: 1 row added')
//     res.redirect('/displaytable');
        
// });

app.route('/new-table-data').post((req,res,next)=>{
    dbObject.collection("menu")
    .insertOne(
        {
            id:Number(req.body.pid),
            name:req.body.dish_name,
            image:req.body.dish_image,
            price:Number(req.body.dish_cost)
        });
        console.log('data inserted');
        next();
}, (_req,res)=>{
    res.redirect("/new-hotel-menu");
    res.end();
});

app.get('/new-hotel-menu',(_req,res)=>{
    res.sendFile("/Users/htq5942/Documents/node-js/hotelMenu/menu.html");
})

app.post('/update-table',(req,res)=>{
    console.log("Your Id is " + req.body.dish_id);
    if(req.body.update_btn){
        dbObject.collection("menu")
        .updateOne(
        {id:Number(req.body.dish_id)},

        {
            $set :
                {
                    "id":Number(req.body.dish_id),
                    "name":req.body.dish_name,
                    "image":req.body.dish_image,
                    "price":Number(req.body.dish_cost)
                }
        });
        console.log('one row Updated');
        res.redirect('/new-hotel-menu');
    }
    else if(req.body.delete_btn){
        dbObject.collection("menu")
        .deleteOne({
            "id":Number(req.body.dish_id)
        });
        console.log('One row deleted');
        res.redirect('/new-hotel-menu');
    }
    else{
      alert('Click Valid Button');
    }
})

app.listen(port, () => console.log(`Listening on port ${port}!`));