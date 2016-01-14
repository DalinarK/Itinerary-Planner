var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    location1 = {
    	location: 'Yosemite',
    	days: '5',
    	demographic: 'group',
    	photos: 'google.com',
    	cost: '$'
    }

    location2 = {
    	location: 'Tahoe',
    	days: '3',
    	demographic: 'group',
    	photos: 'bing.com',
    	cost: '$$'
    }

    var vacationList = [location1, location2];

    $scope.vacationList = vacationList;
}]);﻿
