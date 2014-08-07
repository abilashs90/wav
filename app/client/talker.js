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
})();