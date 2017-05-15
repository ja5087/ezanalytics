var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var low = require('lowdb');

//set up low 

var db = low('db.json');

db.defaults({
    items: []
}).value(); 

//initial state
console.log(db.getState());


app.use(bodyParser.urlencoded({ extended: true }));

app.get('/analytics.png', function(req, res)
{
    var track = req.query.item;
    console.log("value of track is:" + track);
    //if found add count otherwise push new value

    console.log('items found' + db.get('items').find({id:track}).value() );
    if(typeof db.get('items').find({id:track}).value() != "undefined")
    {
     db.get('items').find({id:track}).value().count++;
    } else {
        console.log("new item pushed");
        db.get('items').push({id: track, count: 1}).value();
    }

    var options = {
        root: __dirname,
        dotfiles: 'deny',
        headers: {
             'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    res.sendFile('analytics.png',options);
});

app.get('/summary', function(req,res)
{
    console.log(db.get('items').value());
    res.send(db.get('items').value());
});



app.listen(8081, function() {
    console.log("successful start on port 8081!");
});