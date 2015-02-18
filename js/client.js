$(function(){

	 
	 /*
	connexion
   */
	var socket = io.connect('http://localhost:1337');
	var lastUserMsg = false;
	var msgtpl = $('#msgtpl').html();
		$('#msgtpl').remove(); // je vire le par défault, je gère par mon templateur mustache

		$('#loginform').submit(function(event){
			event.preventDefault();
			socket.emit('login',{
								username: $('#username').val(),
								 mail: $('#mail').val()
								});
			
		});

	   socket.on('logged',function(){

		   	$('#login').fadeOut();
		   	$('#form').fadeIn();
		   	$('#message').focus();
   	
	   });


   /*
	Envoi de message
   */
   	$('#form').submit(function(event){
   		event.preventDefault();
   		socket.emit('newmsg',{message: $('#message').val()});
   		$('#message').val('');
   	});

//celui provenant du serveur toujours
	 socket.on('newmsg',function(message){
	 	var output = Mustache.render(msgtpl,message);
	 	if (lastUserMsg !=message.user.id)
	 	{
	 		$('#messages').append('<div class="separator"></div>');
	 		lastUserMsg = message.user.id;
	 	}
	 	output = '<div class="message">'+output+'</div>';
	 	$('#messages').append(output);

	 	$('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')},500);
	 });



 /*
	gestion des connectés
   */
	socket.on('newusr',function(user){
		//alert('Nouvel utilisateur');
		$('#users').append('<img src="'+user.avatar+'" id="'+user.id+'">');

	});
	socket.on('disusr',function(user){
		$('#'+user.id).remove();
	});

});