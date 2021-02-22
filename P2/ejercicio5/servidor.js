var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io")();

var request = require('request');

let usuarios = new Map();
let proyectos = new Map();

var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};
//estos mimeTypes sirven para definir formatos de los archivos en internet

var httpServer = http.createServer(
	function(request, response) {

		var uri = url.parse(request.url).pathname;
		if (uri=="/") uri = "/inicioAplicacion.html";
		var fname = path.join(process.cwd(), uri);
		fs.exists(fname, function(exists) {
			if (exists) {
				fs.readFile(fname, function(err, data){
					if (!err) {
						var extension = path.extname(fname).split(".")[1];
						var mimeType = mimeTypes[extension];
						response.writeHead(200, mimeType);
						response.write(data);
						response.end();
					}
					else {
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write('Error de lectura en el fichero: '+uri);
						response.end();
					}
				});
			}
			else{
				console.log("Peticion invalida: "+uri);
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write('404 Not Found\n');
				response.end();
			}
		});
	}
);

httpServer.listen(8080, () => {
	console.log('Servidor iniciado');
});

var io = socketio.listen(httpServer);

	io.sockets.on('connection',
		function(client){

			/* io.sockets.emit('actualizarProyectos',proyectos); */

			client.on('registro',function(data){
				var nick=data.nick;
				var password=data.password;

				//Comprueba si el nick es válido
				var usuarioValido=true;
				var passwordValida=true;

				if(usuarios.has(nick) === false){
					usuarios.set(nick,password);
					if(password.length < 4){
						passwordValida=false;
					}
				}else{
					usuarioValido=false;
					passwordValida=false;
				}

				io.sockets.emit('valido',{usuarioValido:usuarioValido,passwordValida:passwordValida});
			});

			client.on('crearProyecto',function(data){
				var nombre = data.nombre;
				var descripcion = data.descripcion;
				var valido=true;

				if(proyectos.has(nombre) === false){
					proyectos.set(nombre,descripcion);
					io.sockets.emit('actualizarProyectos',{nombre:nombre, descripcion:descripcion});
				}else{
					valido=false;
				}

				io.sockets.emit('proyectoValido',{valido:valido});
				console.log("proyecto validado");
			});

			client.on('inicioSesion', function(data){
				var nick=data.nick;
				var password=data.password;

				var usuarioValido=false;
				var passwordValida=false;

				if(usuarios.has(nick) === true){
					usuarioValido=true;
					if(usuarios.get(nick) === password){
						passwordValida=true;
					}
				}

				io.sockets.emit('inicioCorrecto',{usuarioValido:usuarioValido,passwordValida:passwordValida});
			});

		}
	);