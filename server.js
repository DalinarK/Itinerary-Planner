var express = require('express');
var app = express();
var mongojs = require('mongojs');
// var db = mongojs('vacationdb', ['vacationdb']);
var credentials = 'mongodb://gopher:N0vember1@ec2-54-213-159-144.us-west-2.compute.amazonaws.com:27017'
var db = mongojs(credentials, ['vacationdb']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//This route will return all vacations
app.get('/vacationlist', function(req, res) {
	console.log("I received a GET request!!!");
	db.vacationdb.find(function (err, docs) {
		console.log("returning findings from db")
		var documentMod = docs;
		//add a cache time amount for the client to use. Does not work for unknown reasons. Need to research JSON and Objects more.
		documentMod["cache"] = "5";
		//turns it into a JSON string so that it will print out the objects within the array http://stackoverflow.com/questions/14895287/how-to-print-object-array-in-javascript
		var lineJSON = JSON.stringify(documentMod, null, 4);
		// console.info(lineJSON);
		res.json(docs);
	});
});
//
//This route will add a vacation.
app.post('/vacationlist', function(req,res) {
	console.log("I received a POST request!!!")
	console.log(req.body);
	db.vacationdb.insert(req.body, function(err, doc){
		res.json(doc);
	})
	
});

//This route will return one vacation only
app.get('/vacationlist/:id', function (req, res ) {
	var id = req.params.id;
	console.log(id);
	db.vacationdb.findOne({_id: mongojs.ObjectID(id)}, function (err, doc) {
		res.json(doc);
	});
});

//This route handles all of the updating functions
app.put('/vacationlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body);
    if(req.body.arrayUpdate == "true")
    {
    	//Will add activities to the List Entity 
    	console.log("received an array update request")

    	//using push instead of addtoset. Will add activities even if they match with previous activiteis in array.
    	db.vacationdb.findAndModify({query: {_id: mongojs.ObjectId(id)},
    	update: {$push: {list: req.body.list}},
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

//This route adds a user to the database
app.post('/register', function (req, res) {
    console.log("I received a new user Registration!")
    console.log(req.body);
    db.vacationdb.insert(req.body, function(err, doc){
    res.json(doc);
    console.log("this is the response" + doc);
    })

});



//This route handles all of the deleting functions
app.delete('/vacationlist/:id', function(req, res)
{
	console.log("I received a delete request!");
    var id = req.params.id;
    console.log(req.body);
    if (req.body.arrayDelete == "true")
    {
    	//Will search for an Vacation Entity and delete an activity from the List entity
    	console.log("array Delete detected!");
	    db.vacationdb.findAndModify({query: {_id: mongojs.ObjectId(id)},
	    	update: {$pull: {list: {Title: req.body.Title} }}}, 
	    	function (err, doc){
	    		res.json(doc)
	    	}
		);
    }
    else
    {
    	//otherwise will search for a Vacation Entity and delete the whole thing plus it's nested List. 
    	console.log("delete entire vacation detected!");
	    db.vacationdb.findAndModify({query: {_id: mongojs.ObjectId(id)},
	    	remove: true}, 
	    	function (err, doc){
	    		res.json(doc)
	    	}
		);
    }

});

//This route handles all of the deleting functions
app.get('/imgurResponse/:id', function(req, res)
{
	console.log("I received something from imgur!");

  var id = req.params.id;
  console.log(id)

 

      // 	$(function () {
      //   var extractToken = function(hash) {
      //     var match = hash.match(/access_token=(\w+)/);
      //     return !!match && match[1];
      //   };
      //   var setting =
      //     {
      //       'host':     "soundcloud.com"
      //     , 'clientId': YOUR_CLIENT_ID
      //     };
      //   var authHost     = "https://"     + setting.host;
      //   var resourceHost = "https://api." + setting.host;
      //   var endUserAuthorizationEndpoint = authHost + "/connect";
      //   var token = extractToken(document.location.hash);
      //   if (token) {
      //     $('div.authenticated').show();
      //     $('span.token').text(token);
      //     $.ajax({
      //         url: resourceHost + '/me'
      //       , beforeSend: function (xhr) {
      //           xhr.setRequestHeader('Authorization', "OAuth " + token);
      //           xhr.setRequestHeader('Accept',        "application/json");
      //         }
      //       , success: function (response) {
      //           var container = $('span.user');
      //           if (response) {
      //             container.text(response.username);
      //           } else {
      //             container.text("An error occurred.");
      //           }
      //         }
      //     });
      //   } else {
      //     $('div.authenticate').show();
      //     var authUrl = endUserAuthorizationEndpoint + 
      //       "?response_type=token" +
      //       "&client_id="    + setting.clientId +
      //       "&redirect_uri=" + window.location;
      //     $("a.connect").attr("href", authUrl);
      //   }
      // });
});

//body parser module is used to parse the body of the posted text so
//that server understands what it's saving. 

app.listen(3001);
console.log("Server running on port 3001");
