var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
const PORT = 8081;

function handleRequest(request,response){
	try{
		//console.log(request.url);
		dispatcher.dispatch(request,response);
	}
	catch(err){console.log(err);}
}

dispatcher.setStaticDirname(__dirname);
dispatcher.setStatic('resources');

dispatcher.onGet("/", function(request, response) {
    fs.readFile('resources/home.html',function (err, data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end(); 
	});
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

//Logs data to text files
function logMotionSensor(sensor){
var currentdate = new Date(); 

 var logstring = "Motion Detected!\r\n" +  (parseInt(currentdate.getMonth()) +1) + "/"+  currentdate.getDate()
   + "/" + currentdate.getFullYear() + " @ "  
   + currentdate.getHours() + ":"  
   + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "\r\n\r\n"; 
   
//[...]
var logfilename = "resources/MotionLog" + sensor + ".txt";
var alert = "Motion Detected on sensor" + sensor;
console.log(alert)
fs.appendFile(logfilename, logstring, encoding='utf8', function (err) {
    if (err) throw err;
});
}

//Create Server
var server = http.createServer(handleRequest);

//Start Server
server.listen(PORT, function(){
	console.log("Server running at http://localhost:%s", PORT);
});
