var socket = io.connect('http://localhost:3000');

// 接続時
socket.on('connect', function() {
	//connect
	console.log("connected!");
});

// メッセージ受信時
socket.on('message', function(message) {
	console.log(message);
	//message
	$('#memberCount').text(message);
});

// メッセージ受信時
socket.on('talk', function(message) {
	console.log(message);
	//message
	var chatDatetime = message.datetime;
	var chatName = message.name;
	var chatText = message.text;
	var $chat = $('<article>').addClass('chat');
	$chat.append($('<div>').addClass('datetime').text(chatDatetime));
	$chat.append($('<div>').addClass('name').text(chatName));
	$chat.append($('<div>').addClass('text').text(chatText));
	$('#chatLog').append($chat);
	
	setTimeout(function() {
		var speed = 500;
		var targetOffset = $('.timeline')[0].scrollHeight;
		console.log(targetOffset);
		$('.timeline').animate({scrollTop: targetOffset}, speed);
		return false;
	}, 1000);
});

// 切断時
socket.on('disconnect', function() {
	//disconnect
});

$(function() {
	// 送信時
	$('#chatSendBtn').click(function() {
		var chatName = $('#chatName').val();
		var chatText = $('#chatText').val();
		socket.emit('talk', {name:chatName, text:chatText});
	});
	
	$('.timeline').scrollTop(0);
});
