// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

var app = angular.module('app',[]);
app.controller('AppCtrl',function($http){
  vm = this;
  $http({
            method: 'GET',
            url: 'http://localhost:8000/api/gps',
        })
  .success(function(data){
    console.log(data)
    vm.locations = data['locations']

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(27.1879, 31.1696),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();

      var marker, i;

      for (i = 0; i < data.locations.length; i++) {  
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.locations[i]['lat'], data.locations[i]['lon']),
          map: map
        });
        var geocoder = new google.maps.Geocoder();
        var latitude = data.locations[i]['lat'];
        var longitude = data.locations[i]['lon'];
        var address_arr = new Array();
        var latLng = new google.maps.LatLng(latitude,longitude);
        geocoder.geocode({       
            latLng: latLng     
          }, 
        function(responses) 
          {     
            if (responses && responses.length > 0) 
              {    
                // address_arr[i] = responses[0].formatted_address;
                address_arr.push(responses[0].formatted_address);    
              } 
            else 
              {     
                address_arr[i] = 'Not getting address for given latitude and longitude';  
              }   
          }
      );

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {           
            infowindow.setContent(data.locations[i]['Promoter_Id']+ address_arr[i] );
            infowindow.open(map, marker);
          }
        })(marker, i));
    }
  })
})

