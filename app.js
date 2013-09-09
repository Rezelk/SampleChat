/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// HTTPサーバー作成
var server = http.createServer(app);
// HTTPサーバー起動
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// HTTPサーバーとWebScoketを紐付けてサーバー起動
var io = require('socket.io').listen(server);
var memberCount = 0;
// ClientからのWebSocket接続時
io.sockets.on('connection', function(socket) {
	memberCount++;
	// 全員に送信
	io.sockets.emit('message', memberCount);
	
	// ClientからのWebSocketメッセージ受信時
	socket.on('message', function(message) {
		// 全員に送信
		io.sockets.emit('message', message);
	});
	// ClientからのWebSocketメッセージ受信時
	socket.on('talk', function(message) {
		message.datetime = chat.getDatetime();
		// 全員に送信
		io.sockets.emit('talk', message);
	});
	
	// ClientからのWebSocket切断時
	socket.on('disconnect', function() {
		memberCount--;
		// 全員に送信
		io.sockets.emit('message', memberCount);
	});
});

// 名前空間
var chat = {};

/**
 * 現在の日時を文字列で取得する。
 * @returns {String} 日付を"yyyy/mm/dd HH:MM:SS"形式で返却する。
 */
chat.getDatetime = function() {
	// 現在日時をゼロ埋めして文字列として返却
	var now = new Date();
	var year   = ('0000' + now.getFullYear()).slice(-4);
	var month  = (  '00' + (now.getMonth() + 1)).slice(-2);
	var day    = (  '00' + now.getDay()).slice(-2);
	var hour   = (  '00' + now.getHours()).slice(-2);
	var minute = (  '00' + now.getMinutes()).slice(-2);
	var second = (  '00' + now.getSeconds()).slice(-2);
	return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
};
