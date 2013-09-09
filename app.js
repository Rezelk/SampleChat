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

// HTTP�T�[�o�[�쐬
var server = http.createServer(app);
// HTTP�T�[�o�[�N��
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// HTTP�T�[�o�[��WebScoket��R�t���ăT�[�o�[�N��
var io = require('socket.io').listen(server);
var memberCount = 0;
// Client�����WebSocket�ڑ���
io.sockets.on('connection', function(socket) {
	memberCount++;
	// �S���ɑ��M
	io.sockets.emit('message', memberCount);
	
	// Client�����WebSocket���b�Z�[�W��M��
	socket.on('message', function(message) {
		// �S���ɑ��M
		io.sockets.emit('message', message);
	});
	// Client�����WebSocket���b�Z�[�W��M��
	socket.on('talk', function(message) {
		message.datetime = chat.getDatetime();
		// �S���ɑ��M
		io.sockets.emit('talk', message);
	});
	
	// Client�����WebSocket�ؒf��
	socket.on('disconnect', function() {
		memberCount--;
		// �S���ɑ��M
		io.sockets.emit('message', memberCount);
	});
});

// ���O���
var chat = {};

/**
 * ���݂̓����𕶎���Ŏ擾����B
 * @returns {String} ���t��"yyyy/mm/dd HH:MM:SS"�`���ŕԋp����B
 */
chat.getDatetime = function() {
	// ���ݓ������[�����߂��ĕ�����Ƃ��ĕԋp
	var now = new Date();
	var year   = ('0000' + now.getFullYear()).slice(-4);
	var month  = (  '00' + (now.getMonth() + 1)).slice(-2);
	var day    = (  '00' + now.getDay()).slice(-2);
	var hour   = (  '00' + now.getHours()).slice(-2);
	var minute = (  '00' + now.getMinutes()).slice(-2);
	var second = (  '00' + now.getSeconds()).slice(-2);
	return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
};
