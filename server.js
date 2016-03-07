var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
const PORT = 8081;
var MS_BUZZ1 = 1;
var MS_BUZZ2 = 1;

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
    if(MS_BUZZ1 == 1){
		response.end('BUZZ_ON');
	}
	else{
		response.end('BUZZ_OFF');
	}
	logMotionSensor(1);
});    

dispatcher.onGet("/sensor2", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    if(MS_BUZZ2 == 1){
		response.end('BUZZ_ON');
	}
	else{
		response.end('BUZZ_OFF');
	}
	logMotionSensor(2);
});    

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
	if(d.toString().trim() == "MS_BUZZ_1_OFF"){
		console.log("Turned Motion Sensor 1 Buzzer OFF");
	    MS_BUZZ1 = 0;
	}
	if(d.toString().trim() == "MS_BUZZ_1_ON"){
		console.log("Turned Motion Sensor 1 Buzzer ON");
		MS_BUZZ1 = 1;
	}
	
	if(d.toString().trim() == "MS_BUZZ_2_OFF"){
		console.log("Turned Motion Sensor 2 Buzzer OFF");
		MS_BUZZ2 = 0;
	}
	if(d.toString().trim() == "MS_BUZZ_2_ON"){
		console.log("Turned Motion Sensor 2 Buzzer ON");
		MS_BUZZ2 = 1;
	}

	if(d.toString().trim() == "help"){
		console.log("\nSupported Commands: \n\r\nMS_BUZZ_X_ON -- Turns buzzer on X is sensor number\n\r"
		+"MS_BUZZ_X_OFF -- Turns buzzer off X is sensor number\n\r");
	}
	
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
