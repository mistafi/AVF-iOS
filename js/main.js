// JavaScript Document
//AVF Project 1,2,3,4
//Joshua Wisecup
//Term 1309

// Instagram

$( document ).on( "pageinit", ".photo", function() {
	$.mobile.changePage("#photo", {});
	$('#photoList').empty();
	var tag = "bakery";
	var url = 'https://api.instagram.com/v1/tags/'+ tag +
				'/media/recent?callback=?&amp;client_id=453262ad83504533be1195b63bc34d76';	
	$.getJSON(url, results);	
	
});


// put photos in a list
	var results = function(info){
		console.log(info);
	
		$.each(info.data, function(index, photo){
			var pic = "<li><a data-rel='dialog' href='" + photo.images.standard_resolution.url + "' target='_blank'><img src='" + photo.images.thumbnail.url +"'alt='" + photo.user.id + "' /></a></li>";
			$("#photoList").append(pic);
		});
	};	
	
	$(".photoGrid").trigger("create");


$( document ).on( "pageinit", ".bake", function() {
	$.mobile.changePage("#bake", {});
	$('#bakeryList').empty();

var auth = { 
  //
  // Update with your auth tokens.
  //
  consumerKey: "9wv1pSGnfnsKq8Y_yOL1XQ", 
  consumerSecret: "r0lAxJgAEtH-KpaATS2zdZIlWIk",
  accessToken: "9mjG_phIuMbokNCeG5nMfKS0UeTYOlwZ",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "lb5m4BusI8_E2-zBWL4i-NHJzvw",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

var terms = 'bakery';
var near = 'Frankfort, Kentucky';

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

var message = { 
  'action': 'http://api.yelp.com/v2/search',
  'method': 'GET',
  'parameters': parameters 
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);

var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
console.log(parameterMap);

$.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function(data, textStats, XMLHttpRequest) {
    console.log(data);
	console.log(data.total);

	//Pretty Print output
//    var output = prettyPrint(data);
//    $("#bakeryList").append(output);	
	
    var output = [];
    $.each(data, function(i,v){
		for (var i = 0; i < v.length; i++) {
        output.push('<li><a data-rel="dialog" href="' + v[i].mobile_url + '"><img src=' + v[i].image_url + ' /><h2>' + v[i].name + '</h2><p>' + v[i].location.display_address[0] + '<br/>' + v[i].location.display_address[1] + '</p></a></li>');
		}		
	    $("#bakeryList").append(output).trigger("create");	
    });
	
	$(".localBakery").trigger("create");

  }
  
});


});

