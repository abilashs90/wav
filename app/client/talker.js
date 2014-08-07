(function() {
  	'use strict';

 	app.tasks.add('startListning', function(service, config, callback) {
 		console.log(callback);
    	var voice = new webkitSpeechRecognition();
		voice.onresult = function (event) {			
			if(callback) {		
				var text = event.results && event.results[0] && event.results[0][0] && event.results[0][0] && event.results[0][0].transcript;
				callback(text);			
			}			
		};
		voice.start();
	});
})();