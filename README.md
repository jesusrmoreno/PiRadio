PiRadio ver(0.1.0)
==========
Quick web-interface to control Pianobar. 
Written in Node.js. 

For now there are a couple things that you have to do manually such as set your ip address and the number of stations for the scanning button to work.


In the controller-client.js file located under /public/javascripts/:
```javascript
var socket = io.connect('http://192.168.1.13:3000'); 
```

You also have to set the absolute path for your fifo and for the dataFile.

In the app.js file: 
```javascript
var fifoPath = '/Users/pi/pianobar/ctl'; //Remove hard coded path 
var dataFile = '/Users/pi/Desktop/TabardRadio/out'; //Remove hard coded path
```

And finally the eventcmd.sh included has an example of what needs to be included in your eventcmd.sh
```bash
case "$1" in
	songstart)
		# Write to the out file
		rm /Users/pi/Desktop/PiRadio/out # Replace with your own path.
		echo -e "$title\n$artist\n$stationName\n$coverArt" > /Users/pi/Desktop/PiRadio/out # Replace with your own path
esac
```
add that to your eventcmd.sh and replace the path with your own path. 

ToDo:
  1. Remove dependency on Express. An app this simple shouldn't have such a huge dependency. 
  2. Change HTML + CSS code to support all functions from pianobar menu. 
  3. Update UI
