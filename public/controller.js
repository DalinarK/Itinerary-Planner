var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', function($scope, $http) 
{

    $scope.addDestination = function() {

    console.log("user entered data")
    console.log($scope.destination)
    var destData = $scope.destination;
    //Looks through the entered data and changes the season values
    //to their actual names instead of just 'true'
    for(var attribute in destData) {
        if(destData.hasOwnProperty("summer"))
        {
            console.log("summer found!" + destData.summer);
            destData.summer = "summer";
        }
        if(destData.hasOwnProperty("spring"))
        {
            console.log("spring found!" + destData.spring);
            destData.spring = "spring";
        }
        if(destData.hasOwnProperty("fall"))
        {
            console.log("fall found!" + destData.fall);
            destData.fall = "fall";
        }
        if(destData.hasOwnProperty("winter"))
        {
            console.log("winter found!" + destData.winter);
            destData.winter = "winter";
        }
    };

    //sends the data to server.js to be added to the database. It gets
    //the object back + the db ID # on success
    if(destData.hasOwnProperty("location"))
    {
        $http.post('/vacationlist', destData).success(function(response){
        console.log(response);
        });
    }
    refresh();

    };

    $scope.editDestination = function (id)
    {
        console.log(id);
        $http.get('/vacationlist/' + id).success(function(response)
        {
            //translates the previous summer/fall/spring/winter back to a boolean so that
            //the check marks appear on the editing screen.
            var returnData = response
            for(var attribute in returnData) {
                if(returnData.hasOwnProperty("summer"))
                {
                    if(returnData.summer == "summer")
                    {
                        console.log("summer found!" + returnData.summer);
                        returnData.summer = true;
                    }
                }
                if(returnData.hasOwnProperty("spring"))
                {
                    if(returnData.spring == "spring")
                    {
                        console.log("spring found!" + returnData.spring);
                        returnData.spring = true;
                    }
                }
                if(returnData.hasOwnProperty("fall"))
                {
                    if(returnData.fall == "fall")
                    {
                        console.log("fall found!" + returnData.fall);
                        returnData.fall = true;
                    }
                }
                if(returnData.hasOwnProperty("winter"))
                {
                    if(returnData.winter == "winter")
                    {
                        console.log("winter found!" + returnData.winter);
                        returnData.winter = true;
                    }
                }
            };
            $scope.destination = returnData;
        })
    }

    $scope.updateDestination = function() {
        console.log($scope.destination._id);

        var destData = $scope.destination

        for(var attribute in destData) {
            if(destData.hasOwnProperty("summer"))
            {
                if( destData.summer === true)
                {
                    console.log("summer found!" + destData.summer);
                    destData.summer = "summer";
                }
                else if ( destData.summer === false)
                    destData.summer = null;

            }
            if(destData.hasOwnProperty("spring"))
            {
                if( destData.spring === true)
                {
                    console.log("spring found!" + destData.spring);
                    destData.spring = "spring";
                }
                else if ( destData.spring === false)
                    destData.spring = null;

            }
            if(destData.hasOwnProperty("fall"))
            {
                if( destData.fall === true)
                {
                    console.log("fall found!" + destData.fall);
                    destData.fall = "fall";
                }
                else if ( destData.fall === false)
                    destData.fall = null;
            }
            if(destData.hasOwnProperty("winter"))
            {
                if( destData.winter === true)
                {
                    console.log("winter found!" + destData.winter);
                    destData.winter = "winter";
                }
                else if ( destData.winter === false)
                    destData.winter = null;
            }
     };
        $http.put('/vacationlist/' + $scope.destination._id, destData).success(function(response) {
            refresh();
        })

    };

    var refresh = function ()
    {   
        $http.get('/vacationlist').success(function(response) 
        {
            console.log("refreshing page!");
            $scope.vacationlist = response;
            console.log(response);
            $scope.destination = "";
        });
    };

    refresh();



    console.log("Hello World from controller");

});﻿
