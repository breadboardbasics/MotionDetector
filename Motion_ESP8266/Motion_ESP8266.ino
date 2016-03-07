#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#define USE_SERIAL Serial

const int buzzer = 1;
const int sensor = 3;

const char* ssid = "Wee-Fee";
const char* password = "ilikebilly";
const char* ip = "192.168.1.114";
const int port = 8081;

const char* request = "/sensor2";

void setup() {
  Serial.begin(115200);
  delay(5000);
  connectWifi();
  delay(200);
  while(!pingServer());
  Serial.print("Done!");
}

void loop() {
  // put your main code here, to run repeatedly:

}

void connectWifi() {
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

boolean pingServer() {
  HTTPClient http;

  USE_SERIAL.print("[HTTP] begin...\n");
  http.begin(ip, port, request); //HTTP

  USE_SERIAL.print("[HTTP] GET...\n");
  // start connection and send HTTP header
  int httpCode = http.GET();
  if (httpCode) {
    // HTTP header has been send and Server response header has been handled
    USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

    // file found at server
    if (httpCode == 200) {
      String payload = http.getString();
      USE_SERIAL.println(payload);
      return 1;
    }
    else {return 0;}
  }
  else {return 0;} 
}

void beep(){
  digitalWrite(buzzer,HIGH);
  delay(30);
  digitalWrite(buzzer,LOW);
}

