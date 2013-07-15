var gpio = require("pi-gpio");

var TRIGGER = 16; //this library maps the pin to 23
var ECHO = 18; //this library maps the pin to 24

var start = 0;
var end = 0;
gpio.open(TRIGGER, "output", function(err) {     
    setInterval( function(){
        gpio.write(TRIGGER, 1, function() {          
            setTimeout(function(){
                gpio.write(TRIGGER,0);
		start = Date.now();
            },0.001);
        });
    },10);    
});

gpio.open(ECHO, "input",function(err){
    setInterval(function(){
            gpio.read(ECHO, function(err, value) {
            if(err) throw err;
            
            if(value){
                end = Date.now();
            }
            console.log("duration: " + (end-start));
        });
    },10);
});
