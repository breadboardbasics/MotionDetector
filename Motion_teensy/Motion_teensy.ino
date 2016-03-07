int led = 9;
int buzzer = 7;
int sensor = 4;

long led_on_time=0;
byte buffer[80];
unsigned char prev_dtr = 0;

String ssid = "Sisk";
String password = "May2010@";
String ip = "192.168.1.114";
String port = "8081";
String sensorID = "sensor1";

void setup() {
  pinMode(led,OUTPUT);
  pinMode(buzzer,OUTPUT);
  pinMode(sensor,INPUT);
  pinMode(13,OUTPUT);
  Serial1.begin(9600);
  
  digitalWrite(13,LOW);
  
  connectWifi();
  Blink();
  delay(200);
  Blink();
}

void loop() {
  if(digitalRead(sensor)){
   Beep();
   pingServer();
   Blink();
   delay(10000);
  }
}

boolean pingServer(){
  String cmd = "AT+CIPSTART=4,\"TCP\",\"";
  cmd+= ip;
  cmd+= "\",";
  cmd+= port;
  cmd+= "\r\n";
  Serial1.print(cmd);
  delay(300);
  
  Serial1.print("AT+CIPSEND=4,51\r\n"); //51 chars works for sensors 0-9 any more and it will have to go to 51
  delay(300);

  
  cmd = "GET /";
  cmd += sensorID;
  cmd += " HTTP/1.1\r\nHost: ";
  cmd += ip;
  cmd += ":";
  cmd += port;
  cmd += "\r\n\r\n";
  Serial1.print(cmd);
  delay(300);
  return true;
}
  

boolean connectWifi(){
  Serial1.print("AT+CWMODE=3\r\n");
  delay(300);
  Serial1.print("AT+RST\r\n");
  delay(4000);
  Serial1.print("AT+CIPMUX=1\r\n");
  delay(300);
  ClearBuff;
  
  String cmd="AT+CWJAP=\"";
  cmd+= ssid;
  cmd+= "\",\"";
  cmd+= password;
  cmd+= "\"";
  cmd+= "\r\n";
  Serial1.print(cmd);
  delay(10000);
  
  if(Serial1.find("OK")){
    return true;
  }
  else{
    return false;
  }
}


void ClearBuff(){
  while(Serial1.available()){
    int clr = Serial1.read();
  }
}

void Blink(){
  digitalWrite(led,HIGH);
  delay(200);
  digitalWrite(led,LOW);
}

void Beep(){
  digitalWrite(buzzer,HIGH);
  delay(10);
  digitalWrite(buzzer,LOW);
}


