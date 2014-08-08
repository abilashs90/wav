(function() {
  	'use strict';

 	app.tasks.add('startListning', function(callback, interimCallback) {
    	var voice = new webkitSpeechRecognition();
    	var interimText = "";
		voice.onresult = function (event) {	
			if(event.results[0].isFinal) {
				if(callback) {							
					voice.stop();
					callback(event.results[0][0].transcript);			
				}			
			} else {
				interimText = interimText + event.results[0][0].transcript;
				if(interimCallback) {
					interimCallback(event.results[0][0].transcript);
				}
			}						
		};
		voice.interimResults = true;
		voice.start();
	});

	app.tasks.add('capturePic',function(callback,interimCallback){
		var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		video = document.getElementById("video"),
		videoObj = { "video": true },
		errBack = function(error) {
			console.log("Video capture error: ", error.code); 
		};
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
		if (navigator.getUserMedia) {       
    		navigator.getUserMedia({video: true}, handleVideo, videoError);
		}
 
		function handleVideo(stream) {
    		video.src = window.URL.createObjectURL(stream);
		}
 
		function videoError(e) {
    		// do something
		}
		
	});

	app.tasks.add('getCapturedPic',function(callback,interimCallback){
		var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		video = document.getElementById("video");

		context.drawImage(video, 0, 0, 300, 300);
		console.log(canvas);
		var dataURL = canvas.toDataURL("image/png");
		var data = atob( dataURL.substring( "data:image/png;base64,".length ) ),
    		asArray = new Uint8Array(data.length);

		for( var i = 0, len = data.length; i < len; ++i ) {
    		asArray[i] = data.charCodeAt(i);    
		}

		var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );
		callback((window.webkitURL || window.URL).createObjectURL( blob ));

	});
})();