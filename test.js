var gpio = require("gpio");

var TRIGGER = 23;
var ECHO = 24;
var start = 0;
var stop = 0;

var trigger = gpio.export(TRIGGER, {
   // When you export a pin, the default direction is out. This allows you to set
   // the pin value to either LOW or HIGH (3.3V) from your program.
   direction: 'out',

   // Due to the asynchronous nature of exporting a header, you may not be able to
   // read or write to the header right away. Place your logic in this ready
   // function to guarantee everything will get fired properly
   ready: function() {
       console.log('ready for trigger');
       //write one and start reading
       setInterval(function(){
           trigger.set();
           setTimeout(function(){
               trigger.set(0);
               start = Date.now();
               console.log("triggered");
           },0.001);           
       },100);       
   }
});



var echo = gpio.export(ECHO, {
   // When you export a pin, the default direction is out. This allows you to set
   // the pin value to either LOW or HIGH (3.3V) from your program.
   direction: 'in',

   // set the time interval (ms) between each read when watching for value changes
   // note: this is default to 100, setting value too low will cause high CPU usage
   interval: 1,

   // Due to the asynchronous nature of exporting a header, you may not be able to
   // read or write to the header right away. Place your logic in this ready
   // function to guarantee everything will get fired properly
   ready: function() {
       console.log('ready for echo');
       echo.on('change',function(val){
           if(val){
               stop = Date.now();
           }else{
               start = Date.now();               
           }
           var duration = (stop - start);
           console.log("DURATION: " + duration);
       });
   }
});
