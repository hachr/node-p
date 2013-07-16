var net = require("net"),
    repl = require("repl"),
    microtime = require('microtime');

var Gpio = require('onoff').Gpio,    
    TRIGGER = 23, //this library maps the pin to 23
    ECHO = 24, //this library maps the pin to 24
    triggerIO = new Gpio(TRIGGER, 'out'),
    DEBOUNCE_INTERVAL = 60,
    echoIO = new Gpio(ECHO, 'in', 'both', { "persistentWatch":true }),//"debounceInterval":DEBOUNCE_INTERVAL}),
    SOUND = 343 / (1000 * 1000);
                                       

// The callback passed to watch will be called when the button on GPIO #18 is
// pressed. 
var results = [];

var start, stop;
echoIO.watch(function (err, val) {
    if (err) console.log('err: ' + err);
    
    if (val == 0) {
       stop = microtime.now();
       var duration = (stop - start); //microseconds
       var distance = duration * SOUND;
       distance = distance / 2;
       results.push(distance);
    }
    else {
       start = microtime.now();
    }
});

function trigger() {   
   console.log("triggering");
   results = [];
   var SAMPLES = 3;
   var INTERVAL = DEBOUNCE_INTERVAL;
   for (var i = 0; i < SAMPLES; i++) {
      setTimeout(triggerSensor, INTERVAL * (i + 1));
   }

   setTimeout(function() {
     var avg = 0;
     for (var j = 0; j < results.length; j++) {
        avg += results[j];
        console.log(results[j]);
     }
     var end = avg/results.length * 100;
     console.log('Distance: ' + end + ' cm');
   }, INTERVAL * (SAMPLES + 2));
}

function triggerSensor() {
   triggerIO.write(1, function(err) {
       setTimeout(function(){
           triggerIO.write(0);
           start = microtime.now();     
           },1);
   }); 
}

net.createServer(function (socket) {
  var remote = repl.start("node::remote> ", socket);
  //Adding "mood" and "bonus" to the remote REPL's context.
  remote.context.mood = mood;
  remote.context.bonus = "UNLOCKED";
}).listen(5001);

console.log("Remote REPL started on port 5001.");

//A "local" node repl with a custom prompt
var local = repl.start("node::local> ");

// Exposing the function "mood" to the local REPL's context.
local.context.trigger = trigger;
local.context.t = trigger;
