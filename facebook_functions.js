var token;

facebook = {

	facebookLogin: function(){
		FB.login(function(response) {			
			if (response.status === 'connected') {
				token = response.authResponse.accessToken;
				facebook.userLogin(token);
			} else {
				alert("Para comenzar primero debes iniciar con Facebook.");
			}
		}, {scope: 'public_profile,email,user_friends', auth_type: 'rerequest'});
	},

	// logout fb
	facebookLogout: function(){
		FB.logout(function(response) {		   
		});
	},

	userLogin: function(token){
		FB.api('/me?fields=id,first_name,last_name,name,email,gender,friends', function(response) {
			$('#uploadVideo').modal('toggle');			
			facebook.sendToController(response, token);
		});
	},

	/*	-- Get friends
	**	Get only friends data
	**	Usos {
			1: Se pueden guardar en sesion a través de un controlador con la funcion sendToUserController(), 
			2: se pueden colocar las imagenes de los amigos con la funcion getImageFriends()
		}
	*/
	getFriends: function(){		
		FB.api(
			"/me/friends",
			function (response) {
				if (response && !response.error) {
					url = '/me/friends';

					response.data.length < 1 ? cant = false : cant = true;
					// draw img friends
						// facebook.getImageFriends(response.data, cant);
					// set friends into controller
						// sendToUserController(response.data)
				}else{					
				}
			}
		);
	},

	/*	--draw img friends
	**	data: {id_friend, name_friend}
	**	cant: Cantidad de amigos que tiene el usuario logueado (true)
	*/
	getImageFriends: function(data, cant){
		/*if (!cant) {
			$('.div').append('<div class="col-xs-12 col-md-12 friend-block"> Ups! creo que no tienes amigos en Facebook. </div>');
		}else{
			for (var x = 0; x < data.length; x++) {
				id = data[x].id;
				name = data[x].name;			
				$('.imgFriends').append('<div class="col-xs-12 col-md-12 friend-block"><a href="#" class="friend-link" data-id="'+id+'" data-name="'+name+'">'+
									        '<div class="user-img-profile block-left">'+
									          '<img class="img-responsive img-circle img-user-profile" src="https://graph.facebook.com/'+id+'/picture?type=large&height=50&width=50" alt="'+name+'"/>'+
									        '</div>'+
									        '<div class="user-info-profile block-right">'+
									          '<h5>'+name+'</h5>'+
									        '</div>'+
									    '</a></div>');
			}
		}*/
	},

	/* only mobile devices
	**	Open messenger fb to send msjs
	*/
	sendInviteFriends: function(){
		FB.ui({
			method: 'send',
			link: base_url,
		});
	},

	/* Share 
	**	Open share fb (mobile and desktop)
	*/
	shareFB: function(url){
		FB.ui({
			method: 'share',
			display: 'popup',
			hashtag: '#Hashtag',
			quote: 'quote',
			mobile_iframe: true,
			href: url?url:base_url,
		}, function(response){			
		});
	},

	/* Feed
	**	Open Feed fb 
	*/
	feedFB: function(url){
		FB.ui({
			method: 'feed',
			link: 'https://developers.facebook.com/docs/',
  			caption: 'An example caption',
		}, function(response){			
		});
	},

	/* Permissions 
	**	Fn que permite permisos extras
	*/
	getPermissions: function(){
		FB.api(
			'/me/permissions', 
			function(response) {				
			}
		);
	},

	facebookSetCookie: function(token, userID){
		var date = new Date();
		   	date.setTime(date.getTime() + (1*24*60*60*1000));
		var expires = "expires="+ date.toUTCString();
		
		document.cookie = "userID = " + userID + ";" + expires + ";path=/";
		document.cookie = "tokenFB = " + token + ";" + expires + ";path=/";
	},

	facebookDeleteCookie: function(){
		document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "tokenFB=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	},

	// send response data user to controller 
	sendToController: function(data, token){
		var url = base_url + 'home/login';
		var formData = {
				"id_fb": data.id,
				"nombre": data.first_name,
				"apellido": data.last_name,
				"username": data.name,
				"correo_electronico": data.email,
				"genero": data.gender,
				"fb_token": token
			}
		$.ajax({
			url: url,
			type: 'post',
			dataType: 'json',
			data: formData,
		}).done(function(response) {
			// console.log(response);
			if (!response.update_data){
				location.href = base_url + "datos_usuario";
			} else {
				location.href = base_url;
			}
		}).fail(function(response) {
			// failed controller data
		});

	},

}