var http = require("http");
var dispatcher = require('httpdispatcher');
var fs = require('fs');



http.createServer(function (request, response) {
   dispatcher.dispatch(request, response);
   response.end();
}).listen(8081);

dispatcher.setStaticDirname(__dirname);
dispatcher.setStatic('resources');
   
dispatcher.onGet("/", function(request, response) {
    response.writeHeader(200, {"Content-Type": "text/plain"});  
    response.end('This is the home page baby!');  
	console.log('Someone visited main page');
});       
   
dispatcher.onGet("/sensor1", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('This is sensor 1');
	logMotionSensor(1);
});    

dispatcher.onGet("/sensor2", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('This is sensor 2');
	logMotionSensor(2);
});    

function logMotionSensor(sensor){
var currentdate = new Date(); 

 var logstring = "Motion Detected!\r\n" +  (parseInt(currentdate.getMonth()) +1) + "/"+  currentdate.getDate()
   + "/" + currentdate.getFullYear() + " @ "  
   + currentdate.getHours() + ":"  
   + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "\r\n\r\n"; 
   
//[...]
var logfilename = "MotionLog" + sensor + ".txt";
var alert = "Motion Detected on sensor" + sensor;
console.log(alert)
fs.appendFile(logfilename, logstring, encoding='utf8', function (err) {
    if (err) throw err;
});
}

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');




