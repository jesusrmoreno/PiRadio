$(document).ready(function() {
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var socket = io.connect('http://192.168.1.13:3000');
	var pausebtn = $('#pause-btn');
	var stationbtn = $('#station-btn');
	var skipbtn = $('#skip-btn');
	var title = $('#title');
	var station = $('#station');
	var artist = $('#artist');
	var albumart = $('#albumart');


	stationbtn.click(function() {
		var command = 's \n' + getRandomInt(0, 5) + '\n';
		socket.emit('commandQueue', {value: command});
	});

	skipbtn.click(function() {
		var command = 'n';
		socket.emit('commandQueue', {value: command});
	});

	pausebtn.click(function() {
		var command = 'p'
		socket.emit('commandQueue', {value: command});
	});

	socket.on('message', function (data) {
		if(data.message) {
			var titleData = data.message[0];
			var artistData = data.message[1];
			var stationData = data.message[2];
			var albumartData = data.message[3];

			title.html(titleData);
			station.html(stationData);
			artist.html(artistData);
			$('#albumart').css({
				background: 'url('+ albumartData +') no-repeat center center fixed',
				'-webkit-background-size': 'cover'
			});



		// 	background: url(images/bg.jpg) no-repeat center center fixed; 
  // -webkit-background-size: cover;

		} else {
			console.log("There is a problem:", data);
		}
	});
});