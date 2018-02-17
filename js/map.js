
// Hanan Hamed
// 16/02/2018
// Udacity Neighborhood Map Project


// declaring global variables 

var $infoList = $('#infoList');
var $infoHeader = $('#infoHeader');
var $wikiBox = $('#wikiBox');

var initLocations = [
    {
		name: "Chili's Restaurant",
		lat: 21.522731,
		lng: 39.163663
	},{
		name: "Applebee's",
		lat: 21.517830,
		lng: 39.165176
	},{
		name: "Mercure Hotel",
		lat: 21.515694,
		lng: 39.159436
	},{
		name: "InterContinental",
		lat: 21.515345,
		lng: 39.155574
	},{
		name: "Crowne Plaza",
		lat: 21.517421,
		lng: 39.155831
    },{
		name: "McDonald's",
		lat: 21.516303,
		lng: 39.154351
    },{
		name: "Park Hyatt",
		lat: 21.513968,
		lng: 39.154555
    },{
		name: "Strabucks",
		lat: 21.522511,
		lng: 39.162891
    }
];

var map;
var bounds;

// map styles from snazzymaps.com
var styles = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },{
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },{
                "color": "#716464"
            },{
                "weight": "0.01"
            }
        ]
    },{
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "poi.attraction",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },{
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "simplified"
            },{
                "color": "#a05519"
            },{
                "saturation": "-13"
            }
        ]
    },{
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },{
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },{
                "color": "#84afa3"
            },{
                "lightness": 52
            }
        ]
    },{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },{
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
];

// Wikipedia API
// from UDACITY lessons
var ApiInfo = function(name) {

	var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+name+'&limit=20&callback=wikiCallback';

	var wikiRequestTimeOut = setTimeout(function() {
		$infoList.html("");
		$infoHeader.text('Failed to get wikipedia resources. Please check your connection and try again.');
	}, 8000);

	$.ajax({
		url: wikiApiUrl,
		dataType: "jsonp",
		success: function(response) {
			//clear out old data
			$infoList.html("");
			$infoHeader.text("Articles about "+name+" on Wikipedia:");
			var articleList = response[1];
			//get the first five articles from articleList
			var articles = articleList.slice(0,5);
			for(var i = 0; i < articles.length; i++) {
				articleStr = articleList[i];
				var url = 'http://en.wikipedia.org/wiki/'+ articleStr;
				$infoList.append('<li><a href="'+url+'">'+ articleStr +'</a></li>');
			}
			clearTimeout(wikiRequestTimeOut);
		}
	});
};

// The Model
var Location = function(data) {

	var self = this;

	this.name = data.name;
	this.lat = data.lat;
	this.lng = data.lng;


	var defaultIcon = makeMarkerIcon('aa5355');
	var highlightedIcon = makeMarkerIcon('53aaa8');

    // create a new marker
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat, data.lng),
		title: data.name,
		icon: defaultIcon,
		animation: google.maps.Animation.DROP
	});

	// set the marker on the map
	this.marker.setMap(map);

	// when the marker is clicked, get the API info and show it and bounce the marker
	this.marker.addListener('click', function() {
		ApiInfo(data.name);
		$wikiBox.show();
		self.bounce();
	});

	// change the color of the marker when hovering on the marker
	this.marker.addListener('mouseover', function() {
		self.marker.setIcon(highlightedIcon);
	});

	// change the color of the marker to default
	this.marker.addListener('mouseout', function() {
		self.marker.setIcon(defaultIcon);
	});

	// create the marker image 
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +'|40|_|%E2%80%A2',
			new google.maps.Size(25,40),
			new google.maps.Point(0,0),
			new google.maps.Point(10,34),
			new google.maps.Size(25,40));
		return markerImage;
	}

	// animate the marker and then stop the animation after 750ms
	this.bounce = function(loc) {
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ self.marker.setAnimation(null); }, 750);
	};

};


// The ViewModel 
var ViewModel = function() {

	var self = this;

    this.locations = ko.observableArray([]);
    
    this.query = ko.observable('');

    //create the map
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 21.519314, lng: 39.161415}, 
		zoom: 17,
		styles: styles,
		mapTypeControl: false
	});

	// push the defined locations to the observable array
	initLocations.forEach(function(loc) {
		self.locations.push(new Location(loc));
	});

	// set the bounds of the map according to the position of the markers
	bounds = new google.maps.LatLngBounds();
	initLocations.forEach(function(loc) {
		position = {lat: loc.lat, lng: loc.lng};
		bounds.extend(position);
	});
	map.fitBounds(bounds);

	// filter the input search results
    this.filteredLocs = ko.computed(function(){
       return this.locations().filter(function(loc){
       	// clear the map from the markers
       	loc.marker.setMap(null);
           if(loc.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
           	// set the location's marker on the map
           	loc.marker.setMap(map);
           	// show the location name on the list
            return loc.name;
           }
       });
   },this);  

};

var render = function() {
	ko.applyBindings(new ViewModel());
};