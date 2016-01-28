var express = require('express');
var app = express();
var mongojs = require('mongojs');
// var db = mongojs('vacationdb', ['vacationdb']);
var credentials = 'mongodb://gopher:N0vember1@ec2-54-213-159-144.us-west-2.compute.amazonaws.com:27017'
var db = mongojs(credentials, ['vacationdb']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/vacationlist', function(req, res) {
	console.log("I received a GET request!!!");
	db.vacationdb.find(function (err, docs) {
		console.log("returning findings from db")
		//turns it into a JSON string so that it will print out the objects within the array http://stackoverflow.com/questions/14895287/how-to-print-object-array-in-javascript
		var lineJSON = JSON.stringify(docs, null, 4);
		console.info(lineJSON);
		res.json(docs);
	});
});


app.post('/vacationlist', function(req,res) {
	console.log("I received a POST request!!!")
	console.log(req.body);
	db.vacationdb.insert(req.body, function(err, doc){
		res.json(doc);	
	})
});

app.get('/vacationlist/:id', function (req, res ) {
	var id = req.params.id;
	console.log(id);
	db.vacationdb.findOne({_id: mongojs.ObjectID(id)}, function (err, doc) {
		res.json(doc);
	});
});

app.put('/vacationlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body);
    if(req.body.arrayUpdate == "true")
    {
    	//Will add activities to the List Entity 
    	console.log("received an array update request")

    	//using push instead of addtoset. Will add activities even if they match with previous activiteis in array.
    	db.vacationdb.findAndModify({query: {_id: mongojs.ObjectId(id)},
    	update: {$push: {list: req.list}},
    	new: true}
    	, function (err, doc){
    		res.json(doc);
    	}

	);
    }
    else
    {
    	//Will update entries in the Vacation Entity
    	db.vacationdb.findAndModify({query: {_id: mongojs.ObjectId(id)},
    	update: {$set: {location: req.body.location, days: req.body.days, demographic: req.body.demographic, summer: req.body.summer, spring: req.body.spring, fall: req.body.fall, winter: req.body.winter, cost: req.body.cost}},
    	new: true}
    	, function (err, doc){
    		res.json(doc);
    	}

	);
    }

});

app.delete('/vacationlist/:id', function(req, res)
{
	console.log("I received a delete request!");
    var id = req.params.id;
    console.log(req.body);
    db.vacationdb.findAndModify({query: {_id: mongojs.ObjectId(id)},
    	remove: true}, 
    	function (err, doc){
    		res.json(doc)
    	}
	);
});

//body parser module is used to parse the body of the posted text so
//that server understands what it's saving. 

app.listen(3001);
console.log("Server running on port 3001");
