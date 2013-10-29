// JavaScript Document
//AVF Project 1,2,3,4
//Joshua Wisecup
//Term 1310	




    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
				
		$('#camLink').on('click', function(){
			
			alert('Are you ready to take a picture?');
			
			$('#clearBtn').on('click', function () {
					$('#photoRecent').empty().after('<img src="" />').append('<img src="" />');
			});
			
			var cameraOptions = {
					quality: 50, 
					destinationType: Camera.DestinationType.FILE_URI,
					saveToPhotoAlbum: true                             
			};
	
			$('#camBtn').on('click', function() {
					navigator.camera.getPicture(cameraSuccess, cameraFail, cameraOptions);
			});
			function cameraSuccess(imageURI) {
					$('#photoRecent img').attr('src', imageURI).css('display', 'block');
			}
	
			function cameraFail(message) {
					alert('Sorry! Camera failed due to: ' + message);
			}
						
		});	
		
 		$('#geoLink').on('click', function(){
			$('#geoList').empty();
			var watchID = null;
        	var options = { frequency: 3000 };
        	watchID = navigator.geolocation.watchPosition(geoSuccess, geoError, options);
				
				function geoSuccess(position) {
					var element = document.getElementById('geoList');
					element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
										'Longitude: '          + position.coords.longitude             + '<br />' +
										'Altitude: '           + position.coords.altitude              + '<br />' +
										'Accuracy: '           + position.coords.accuracy              + '<br />' +
										'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
										'Heading: '            + position.coords.heading               + '<br />' +
										'Speed: '              + position.coords.speed                 + '<br />' +
										'Timestamp: '          + new Date(position.timestamp * 1000)   + '<br />';
				}
				
				function geoError(error) {
						if( error == 1) {
								alert('Please turn on Geolocation services.');
						}
				} 
		});	
		
		$('#moveLink').on('click', function(){
        	navigator.accelerometer.getCurrentAcceleration(accelSuccess, accelError);
		});
		
		
		$('#compassLink').on('click', function(){
        	navigator.compass.getCurrentHeading(comSuccess, comError);
			// onSuccess: Get the current heading
			//
			function comSuccess(heading) {
				alert('Heading: ' + heading.magneticHeading);
			}
			// onError: Failed to get the heading
			//
			function comError(compassError) {
				alert('Compass Error: ' + compassError.code);
			}
		});
					
    }

    // onSuccess: Get a snapshot of the current acceleration
    //
    function accelSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    }

    // onError: Failed to get the acceleration
    //
    function accelError() {
        alert('onError!');
    }


	// Instagram
	$(document).on( "pageinit", ".photo", function() {
				 
		$.mobile.changePage("#photo", {});
		$('#photoList').empty();
	
		var tag = "bakery";
		$.ajax({
			url: 'https://api.instagram.com/v1/tags/'+ tag +
							'/media/recent?callback=?&amp;client_id=453262ad83504533be1195b63bc34d76',
			dataType: "jsonp",
			success: function(dataObj) {
					// console.log(dataObj.data)
					
					// For each post/image returned
					$.each(dataObj.data, function(index, photo) {
						$("<li><a data-rel='dialog' href='" + photo.images.standard_resolution.url + "' target='_blank'><img src='" + photo.images.thumbnail.url +"'alt='" + photo.user.id + "' /></a></li>"
							).appendTo($("#photoList"));
					});                                                                                        
			}
		});
		$(".photoGrid").trigger("create");			
	});
	
	// Yelp
	$(document).on( "pageinit", ".bake", function() {
		
			$.mobile.changePage("#bake", {});
			$('#bakeryList').empty();
		
			var auth = { 
			  //
			  // Update with your auth tokens.
			  //
			  consumerKey: "9wv1pSGnfnsKq8Y_yOL1XQ", 
			  consumerSecret: "r0lAxJgAEtH-KpaATS2zdZIlWIk",
			  accessToken: "XfGT_q_nftkfniPPjQJe92fH6iAQtujz",
			  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
			  // You wouldn't actually want to expose your access token secret like this in a real application.
			  accessTokenSecret: "2R86HMvit13Cv6gVl8lWRD_iS0U",
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
			  
			}); //end ajax call...
	
	}); //end doc ready
		