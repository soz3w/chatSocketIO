//serveur JS
//Communication reseaux
//communication avec IRC

//console.log('salut');

var http = require('http');
//var md5=require('MD5');
var crypto = require('crypto'); 


httpServer = http.createServer(function(req,res){
	console.log('un utilisateur a affiché la page');
	//res.end('Hello world');
});

httpServer.listen(1337);

var io= require('socket.io').listen(httpServer);

var users={};
var messages=[];
var msgHistory = 2;

io.sockets.on('connection',function(socket){
	var me;
	me = false;
	console.log('nouveau utilisetur');

	for (var k in users)
	{
		socket.emit('newusr',users[k]);
	}
	for (var k in messages)
	{
		socket.emit('newmsg',messages[k]);
	}


	//connexion
	socket.on('login',function(user){
		
		me = user;
		me.id=user.mail.replace('@','-').replace('.','-');

		var md5 = crypto.createHash('md5');
		me.id = md5.update(user.mail).digest("hex");
		me.avatar ='https://gravatar.com/avatar/'+ me.id+'?s=50';
		console.log(me);

		socket.emit('logged');
		users[me.id]=me;
		//socket.broadcast.emit('newusr'); tous sauf le courant
		io.sockets.emit('newusr',me);
	});

	//nouveau message
	socket.on('newmsg',function(message){
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		messages.push(message);
		if (messages.length > msgHistory)
			{
				messages.shift();
			}
		io.sockets.emit('newmsg',message); // different car emit coté serveur


	});

	//deconnexion
	socket.on('disconnect',function(){
		if(!me)
		{
			return false;
		}
		delete users[me.id]	;
		io.sockets.emit('disusr',me);
	});

});